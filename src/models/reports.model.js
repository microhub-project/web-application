import database from "../database/config.js";

async function getGeralFunc(empresa_uuid) {
    let query = `SELECT
    u.nome AS funcionario,
    COUNT(a.uuid) AS alertas_resolvidos,
    CAST(ROUND(AVG(TIMESTAMPDIFF(SECOND, a.criado_em, a.data_hora_resolvido)) / 60) AS UNSIGNED) AS tempo_medio_resolucao_min,
    CAST(ROUND(MIN(TIMESTAMPDIFF(SECOND, a.criado_em, a.data_hora_resolvido)) / 60) AS UNSIGNED) AS alerta_mais_rapido_min,
    CAST(ROUND(MAX(TIMESTAMPDIFF(SECOND, a.criado_em, a.data_hora_resolvido)) / 60) AS UNSIGNED) AS alerta_mais_demorado_min
    FROM 'microhub'.'alerta' a
    JOIN 'microhub'.'usuario' u
    ON u.uuid = a.resolvido_por
    AND u.empresa_uuid = a.empresa_uuid
    WHERE a.empresa_uuid = UUID_TO_BIN('${empresa_uuid}')
    AND u.deletado_em IS NULL
    AND a.data_hora_resolvido IS NOT NULL
    AND a.data_hora_resolvido >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
    AND a.data_hora_resolvido <  DATE_FORMAT(CURDATE(), '%Y-%m-01') + INTERVAL 1 MONTH
    GROUP BY u.uuid, u.nome
    ORDER BY AVG(TIMESTAMPDIFF(SECOND, a.criado_em, a.data_hora_resolvido)) ASC;`

    return await database.execute(query)
}