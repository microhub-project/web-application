import database from "../database/config.js";

async function getGeralFunc(empresa_uuid) {
  let query = `SELECT
    u.nome AS funcionario,
    COUNT(a.uuid) AS alertas_resolvidos,
    CAST(ROUND(AVG(TIMESTAMPDIFF(SECOND, a.criado_em, a.data_hora_resolvido)) / 60) AS UNSIGNED) AS media,
    CAST(ROUND(MIN(TIMESTAMPDIFF(SECOND, a.criado_em, a.data_hora_resolvido)) / 60) AS UNSIGNED) AS alertaMin,
    CAST(ROUND(MAX(TIMESTAMPDIFF(SECOND, a.criado_em, a.data_hora_resolvido)) / 60) AS UNSIGNED) AS alertaMax
    FROM microhub.alerta a
    JOIN microhub.usuario u
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

async function getGeralInst(empresa_uuid) {
  let query = `SELECT
    COALESCE(i.nome, i.endereco_mac) AS nome,
    CAST(ROUND(SUM(TIMESTAMPDIFF(SECOND, a.criado_em, a.data_hora_resolvido)) / 60) AS SIGNED) AS total,
    COUNT(a.uuid) AS alertas,
    CAST(ROUND(MAX(TIMESTAMPDIFF(SECOND, a.criado_em, a.data_hora_resolvido)) / 60) AS SIGNED) AS maior,
    (SELECT c2.nome
       FROM microhub.alerta a2
       JOIN microhub.componente c2
         ON c2.uuid = a2.instancia_tem_componente_componente_uuid
      WHERE a2.instancia_tem_componente_instancia_uuid = i.uuid
        AND MONTH(a2.data_hora_resolvido) = MONTH(CURDATE())
        AND YEAR(a2.data_hora_resolvido) = YEAR(CURDATE())
      GROUP BY c2.uuid, c2.nome_tecnico
      ORDER BY COUNT(*) DESC
      LIMIT 1) AS componente
      FROM microhub.alerta a
      JOIN microhub.instancia i
      ON i.uuid = a.instancia_tem_componente_instancia_uuid
      JOIN microhub.microsservico m
    ON m.uuid = i.microsservico_uuid
    WHERE m.empresa_uuid = UUID_TO_BIN('${empresa_uuid}')
    AND i.deletado_em IS NULL
    AND a.data_hora_resolvido IS NOT NULL
    AND MONTH(a.data_hora_resolvido) = MONTH(CURDATE())
    AND YEAR(a.data_hora_resolvido) = YEAR(CURDATE())
    GROUP BY i.uuid, i.nome, i.endereco_mac
    ORDER BY SUM(TIMESTAMPDIFF(SECOND, a.criado_em, a.data_hora_resolvido)) DESC;`

  return await database.execute(query)
}

async function getTotalAlertas(empresa_uuid) {
  let query = `SELECT COUNT(*) AS total
    FROM microhub.alerta
    WHERE empresa_uuid = UUID_TO_BIN('${empresa_uuid}')
    AND MONTH(NOW())
    AND YEAR(NOW());`

    return await database.execute(query)
}

async function getRankingAlertas(empresa_uuid) {
  let query = `SELECT
    c.nome AS name,
    COUNT(a.uuid) value
    FROM microhub.alerta a
    JOIN microhub.componente c ON c.uuid = a.instancia_tem_componente_componente_uuid
    JOIN microhub.instancia i ON i.uuid = a.instancia_tem_componente_instancia_uuid
    JOIN microhub.microsservico m ON m.uuid = i.microsservico_uuid
    WHERE m.empresa_uuid = UUID_TO_BIN('${empresa_uuid}')
    AND MONTH(a.criado_em) = MONTH(CURDATE())
    AND YEAR(a.criado_em) = YEAR(CURDATE())
    GROUP BY c.uuid, c.nome
    ORDER BY value DESC;`

    return await database.execute(query)
}

export default {
  getGeralFunc,
  getGeralInst,
  getTotalAlertas,
  getRankingAlertas
};