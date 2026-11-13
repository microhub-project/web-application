
import database from "../database/config.js";


const getInstances = async (empresa_uuid) => {
    const query = `
        SELECT
            BIN_TO_UUID(i.uuid) AS uuid,
            i.endereco_mac,
            i.nome,
            m.nome AS microsservico,
            i.deletado_em,
            i.criado_em,
            t.nome AS tipo,
            t.custo_computacao,
            IFNULL(ROUND(v.custo_total, 2), 0) AS custo_armazenamento,
            (t.custo_computacao + IFNULL(ROUND(v.custo_total, 2), 0)) AS custo_mensal
        FROM instancia i
        JOIN microsservico m
            ON i.microsservico_uuid = m.uuid
        JOIN tipo t
            ON i.tipo_uuid = t.uuid
        LEFT JOIN (
            SELECT
                instancia_uuid,
                SUM(custo_giga * armazenamento) AS custo_total
            FROM volume
            GROUP BY instancia_uuid
        ) v
            ON v.instancia_uuid = i.uuid
        WHERE m.empresa_uuid = UUID_TO_BIN(?)
          AND i.deletado_em IS NOT NULL;
    `;

    return await database.execute(query, [empresa_uuid]);
};

const getItens = async (uuid, empresa_uuid) => {
    const query = `
        SELECT
            BIN_TO_UUID(i.uuid) AS uuid,
            i.endereco_mac,
            i.nome,
            m.nome AS microsservico,
            i.deletado_em,
            i.criado_em,
            t.nome AS tipo,
            t.custo_computacao,
            IFNULL(ROUND(v.custo_total, 2), 0) AS custo_armazenamento,
            (t.custo_computacao + IFNULL(ROUND(v.custo_total, 2), 0)) AS custo_mensal
        FROM instancia i
        JOIN microsservico m
            ON i.microsservico_uuid = m.uuid
        JOIN tipo t
            ON i.tipo_uuid = t.uuid
        LEFT JOIN (
            SELECT
                instancia_uuid,
                SUM(custo_giga * armazenamento) AS custo_total
            FROM volume
            GROUP BY instancia_uuid
        ) v
            ON v.instancia_uuid = i.uuid
        WHERE m.empresa_uuid = UUID_TO_BIN(?) 
          AND i.uuid = UUID_TO_BIN(?)
          AND i.deletado_em IS NOT NULL;
    `;

    return await database.execute(query, [empresa_uuid, uuid]);
};

export default {
    getInstances,
    getItens
};