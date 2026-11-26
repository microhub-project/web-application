import database from "../database/config.js";

const getInstances = async (empresa_uuid) => {
    const query = `
        SELECT
            BIN_TO_UUID(i.uuid) AS uuid,
            i.endereco_mac,
            i.nome,
            BIN_TO_UUID(m.uuid) AS microsservico_uuid,
            m.nome AS microsservico,
            BIN_TO_UUID(t.uuid) AS tipo_uuid,
            t.nome AS tipo,
            t.cpu,
            t.ram,
            t.custo_computacao,
            IFNULL(ROUND(v.custo_total, 2), 0) AS custo_armazenamento,
            (
                t.custo_computacao +
                IFNULL(ROUND(v.custo_total, 2), 0)
            ) AS custo_mensal
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
          AND m.deletado_em IS NULL
          AND i.deletado_em IS NULL
        ORDER BY i.nome;
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
            i.criado_em,
            BIN_TO_UUID(t.uuid) AS tipo_uuid,
            t.nome AS tipo,
            t.cpu,
            t.ram,
            t.custo_computacao,
            IFNULL(ROUND(v.custo_total, 2), 0) AS custo_armazenamento,
            (
                t.custo_computacao +
                IFNULL(ROUND(v.custo_total, 2), 0)
            ) AS custo_mensal
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
          AND m.deletado_em IS NULL
          AND i.uuid = UUID_TO_BIN(?)
          AND i.deletado_em IS NULL;
    `;

    return await database.execute(query, [empresa_uuid, uuid]);
};

// Nome da empresa para localizar o JSON histórico no S3
const getCompanyName = async (empresa_uuid) => {
    const query = `
        SELECT nome_fantasia
        FROM empresa
        WHERE uuid = UUID_TO_BIN(?);
    `;

    return await database.execute(query, [empresa_uuid]);
};

// Limites configurados para os componentes monitorados
const getThresholds = async (empresa_uuid) => {
    const query = `
        SELECT
            BIN_TO_UUID(ic.instancia_uuid) AS instancia_uuid,
            c.nome_tecnico,
            ic.limite_minimo,
            ic.limite_maximo,
            ic.monitorado
        FROM instancia_tem_componente ic
        JOIN componente c
            ON ic.componente_uuid = c.uuid
        JOIN instancia i
            ON ic.instancia_uuid = i.uuid
        JOIN microsservico m
            ON i.microsservico_uuid = m.uuid
        WHERE m.empresa_uuid = UUID_TO_BIN(?)
          AND m.deletado_em IS NULL
          AND i.deletado_em IS NULL;
    `;

    return await database.execute(query, [empresa_uuid]);
};

// Tipos disponíveis para recomendar aumento ou redução vertical
const getTypes = async () => {
    const query = `
        SELECT
            BIN_TO_UUID(uuid) AS uuid,
            nome,
            cpu,
            ram,
            custo_computacao
        FROM tipo
        ORDER BY cpu ASC, ram ASC;
    `;

    return await database.execute(query, []);
};

export default {
    getInstances,
    getItens,
    getCompanyName,
    getThresholds,
    getTypes
};