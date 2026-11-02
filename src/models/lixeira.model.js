
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



const getMicrosservices = async (empresa_uuid) => {
    const query = `
        SELECT
            BIN_TO_UUID(m.uuid) AS uuid,
            m.nome,
            m.descricao,
            GROUP_CONCAT(
                IFNULL(i.nome, i.endereco_mac)
                SEPARATOR ', '
            ) AS instancias_associadas,
            m.criado_em,
            m.deletado_em
        FROM microsservico m
        LEFT JOIN instancia i
            ON i.microsservico_uuid = m.uuid
        WHERE m.empresa_uuid = UUID_TO_BIN(?)
          AND m.deletado_em IS NOT NULL
        GROUP BY
            m.uuid,
            m.nome,
            m.descricao,
            m.criado_em,
            m.deletado_em;
    `;

    return await database.execute(query, [empresa_uuid]);
};



const getComponentes = async (empresa_uuid) => {
    const query = `
        SELECT
            BIN_TO_UUID(c.uuid) AS uuid,
            c.nome,
            itc.limite_maximo,
            itc.limite_minimo,
            BIN_TO_UUID(i.uuid) AS instancia_uuid,
            IFNULL(i.nome, i.endereco_mac) AS instancia_associada,
            itc.criado_em,
            itc.deletado_em
        FROM instancia_tem_componente itc
        JOIN componente c
            ON itc.componente_uuid = c.uuid
        JOIN instancia i
            ON itc.instancia_uuid = i.uuid
        JOIN microsservico m
            ON i.microsservico_uuid = m.uuid
        WHERE m.empresa_uuid = UUID_TO_BIN(?)
          AND itc.monitorado = 1
          AND itc.deletado_em IS NOT NULL
          AND i.deletado_em IS NULL;
    `;

    return await database.execute(query, [empresa_uuid]);
};



const getUsuarios = async (empresa_uuid) => {
    const query = `
        SELECT
            BIN_TO_UUID(u.uuid) AS uuid,
            u.nome,
            u.cargo,
            u.email,
            u.criado_em,
            u.deletado_em
        FROM usuario u
        WHERE u.empresa_uuid = UUID_TO_BIN(?)
          AND u.deletado_em IS NOT NULL;
    `;

    return await database.execute(query, [empresa_uuid]);
};



const getVolumes = async (empresa_uuid) => {
    const query = `
        SELECT
            BIN_TO_UUID(v.uuid) AS uuid,
            v.armazenamento,
            IFNULL(i.nome, i.endereco_mac) AS instancia_associada,
            ROUND(v.custo_giga * v.armazenamento, 2) AS custo_volume,
            v.criado_em,
            v.deletado_em
        FROM volume v
        JOIN instancia i
            ON v.instancia_uuid = i.uuid
        JOIN microsservico m
            ON i.microsservico_uuid = m.uuid
        WHERE m.empresa_uuid = UUID_TO_BIN(?)
          AND i.deletado_em IS NULL
          AND v.deletado_em IS NOT NULL;
    `;

    return await database.execute(query, [empresa_uuid]);
};



const restoreInstance = async (instancia_uuid, empresa_uuid) => {

    return await database.transaction(async (connection) => {

        // 1. Recupera a instância
        const [resultado] = await connection.execute(`
            UPDATE instancia i
            JOIN microsservico m
                ON i.microsservico_uuid = m.uuid
            SET
                i.status = 1,
                i.deletado_em = NULL
            WHERE i.uuid = UUID_TO_BIN(?)
              AND m.empresa_uuid = UUID_TO_BIN(?)
              AND i.deletado_em IS NOT NULL;
        `, [instancia_uuid, empresa_uuid]);

        if (resultado.affectedRows !== 1) {
            return resultado;
        }

        // 2. Recupera os componentes da instância
        await connection.execute(`
            UPDATE instancia_tem_componente
            SET
                status = 1,
                deletado_em = NULL
            WHERE instancia_uuid = UUID_TO_BIN(?)
              AND deletado_em IS NOT NULL;
        `, [instancia_uuid]);

        // 3. Recupera os volumes da instância
        await connection.execute(`
            UPDATE volume
            SET
                status = 1,
                deletado_em = NULL
            WHERE instancia_uuid = UUID_TO_BIN(?)
              AND deletado_em IS NOT NULL;
        `, [instancia_uuid]);

        return resultado;
    });
};



const restoreMicroservice = async (microsservico_uuid, empresa_uuid) => {
    const query = `
        UPDATE microsservico
        SET
            status = 1,
            deletado_em = NULL
        WHERE uuid = UUID_TO_BIN(?)
          AND empresa_uuid = UUID_TO_BIN(?)
          AND deletado_em IS NOT NULL;
    `;

    const resultado = await database.execute(query, [
        microsservico_uuid,
        empresa_uuid
    ]);

    return resultado;
};



const restoreComponent = async (componente_uuid, instancia_uuid, empresa_uuid) => {
    const query = `
        UPDATE instancia_tem_componente itc
        JOIN instancia i
            ON itc.instancia_uuid = i.uuid
        JOIN microsservico m
            ON i.microsservico_uuid = m.uuid
        SET
            itc.status = 1,
            itc.deletado_em = NULL
        WHERE itc.componente_uuid = UUID_TO_BIN(?)
          AND itc.instancia_uuid = UUID_TO_BIN(?)
          AND m.empresa_uuid = UUID_TO_BIN(?)
          AND itc.deletado_em IS NOT NULL
          AND i.deletado_em IS NULL;
    `;

    const resultado = await database.execute(query, [
        componente_uuid,
        instancia_uuid,
        empresa_uuid
    ]);

    return resultado;
};


const restoreUser = async (usuario_uuid, empresa_uuid) => {
    const query = `
        UPDATE usuario
        SET
            status = 1,
            deletado_em = NULL
        WHERE uuid = UUID_TO_BIN(?)
          AND empresa_uuid = UUID_TO_BIN(?)
          AND deletado_em IS NOT NULL;
    `;

    const resultado = await database.execute(query, [
        usuario_uuid,
        empresa_uuid
    ]);

    return resultado;
};


const restoreVol = async (volume_uuid, empresa_uuid) => {
    const query = `
        UPDATE volume v
        JOIN instancia i
            ON v.instancia_uuid = i.uuid
        JOIN microsservico m
            ON i.microsservico_uuid = m.uuid
        SET
            v.status = 1,
            v.deletado_em = NULL
        WHERE v.uuid = UUID_TO_BIN(?)
          AND m.empresa_uuid = UUID_TO_BIN(?)
          AND v.deletado_em IS NOT NULL
          AND i.deletado_em IS NULL;
    `;

    const resultado = await database.execute(query, [
        volume_uuid,
        empresa_uuid
    ]);

    return resultado;
};


const deleteInstance = async (instancia_uuid, empresa_uuid) => {

    return await database.transaction(async (connection) => {

        // 1. Exclui os alertas relacionados à instância
        await connection.execute(`
            DELETE a
            FROM alerta a
            JOIN instancia_tem_componente itc
                ON a.instancia_tem_componente_componente_uuid = itc.componente_uuid
                AND a.instancia_tem_componente_instancia_uuid = itc.instancia_uuid
            JOIN instancia i
                ON itc.instancia_uuid = i.uuid
            JOIN microsservico m
                ON i.microsservico_uuid = m.uuid
            WHERE i.uuid = UUID_TO_BIN(?)
              AND m.empresa_uuid = UUID_TO_BIN(?)
              AND i.deletado_em IS NOT NULL;
        `, [instancia_uuid, empresa_uuid]);


        // 2. Exclui os componentes associados à instância
        await connection.execute(`
            DELETE itc
            FROM instancia_tem_componente itc
            JOIN instancia i
                ON itc.instancia_uuid = i.uuid
            JOIN microsservico m
                ON i.microsservico_uuid = m.uuid
            WHERE i.uuid = UUID_TO_BIN(?)
              AND m.empresa_uuid = UUID_TO_BIN(?)
              AND i.deletado_em IS NOT NULL;
        `, [instancia_uuid, empresa_uuid]);


        // 3. Exclui os volumes associados à instância
        await connection.execute(`
            DELETE v
            FROM volume v
            JOIN instancia i
                ON v.instancia_uuid = i.uuid
            JOIN microsservico m
                ON i.microsservico_uuid = m.uuid
            WHERE i.uuid = UUID_TO_BIN(?)
              AND m.empresa_uuid = UUID_TO_BIN(?)
              AND i.deletado_em IS NOT NULL;
        `, [instancia_uuid, empresa_uuid]);


        // 4. Exclui definitivamente a instância
        const [resultado] = await connection.execute(`
            DELETE i
            FROM instancia i
            JOIN microsservico m
                ON i.microsservico_uuid = m.uuid
            WHERE i.uuid = UUID_TO_BIN(?)
              AND m.empresa_uuid = UUID_TO_BIN(?)
              AND i.deletado_em IS NOT NULL;
        `, [instancia_uuid, empresa_uuid]);


        return resultado;
    });
};



const deleteMicroservice = async (microsservico_uuid, empresa_uuid) => {

    return await database.transaction(async (connection) => {

        // 1. Exclui os alertas das instâncias do microsserviço
        await connection.execute(`
            DELETE a
            FROM alerta a
            JOIN instancia_tem_componente itc
                ON a.instancia_tem_componente_componente_uuid = itc.componente_uuid
                AND a.instancia_tem_componente_instancia_uuid = itc.instancia_uuid
            JOIN instancia i
                ON itc.instancia_uuid = i.uuid
            WHERE i.microsservico_uuid = UUID_TO_BIN(?)
              AND EXISTS (
                  SELECT 1
                  FROM microsservico m
                  WHERE m.uuid = i.microsservico_uuid
                    AND m.empresa_uuid = UUID_TO_BIN(?)
                    AND m.deletado_em IS NOT NULL
              );
        `, [microsservico_uuid, empresa_uuid]);

        // 2. Exclui os vínculos dos componentes
        await connection.execute(`
            DELETE itc
            FROM instancia_tem_componente itc
            JOIN instancia i
                ON itc.instancia_uuid = i.uuid
            JOIN microsservico m
                ON i.microsservico_uuid = m.uuid
            WHERE m.uuid = UUID_TO_BIN(?)
              AND m.empresa_uuid = UUID_TO_BIN(?)
              AND m.deletado_em IS NOT NULL;
        `, [microsservico_uuid, empresa_uuid]);

        // 3. Exclui os volumes
        await connection.execute(`
            DELETE v
            FROM volume v
            JOIN instancia i
                ON v.instancia_uuid = i.uuid
            JOIN microsservico m
                ON i.microsservico_uuid = m.uuid
            WHERE m.uuid = UUID_TO_BIN(?)
              AND m.empresa_uuid = UUID_TO_BIN(?)
              AND m.deletado_em IS NOT NULL;
        `, [microsservico_uuid, empresa_uuid]);

        // 4. Exclui as instâncias
        await connection.execute(`
            DELETE i
            FROM instancia i
            JOIN microsservico m
                ON i.microsservico_uuid = m.uuid
            WHERE m.uuid = UUID_TO_BIN(?)
              AND m.empresa_uuid = UUID_TO_BIN(?)
              AND m.deletado_em IS NOT NULL;
        `, [microsservico_uuid, empresa_uuid]);

        // 5. Exclui definitivamente o microsserviço
        const [resultado] = await connection.execute(`
            DELETE FROM microsservico
            WHERE uuid = UUID_TO_BIN(?)
              AND empresa_uuid = UUID_TO_BIN(?)
              AND deletado_em IS NOT NULL;
        `, [microsservico_uuid, empresa_uuid]);

        return resultado;
    });
};




const deleteComponent = async (componente_uuid, instancia_uuid, empresa_uuid) => {

    return await database.transaction(async (connection) => {

        // 1. Exclui os alertas relacionados ao componente da instância
        await connection.execute(`
            DELETE a
            FROM alerta a
            JOIN instancia_tem_componente itc
                ON a.instancia_tem_componente_componente_uuid = itc.componente_uuid
                AND a.instancia_tem_componente_instancia_uuid = itc.instancia_uuid
            JOIN instancia i
                ON itc.instancia_uuid = i.uuid
            JOIN microsservico m
                ON i.microsservico_uuid = m.uuid
            WHERE itc.componente_uuid = UUID_TO_BIN(?)
              AND itc.instancia_uuid = UUID_TO_BIN(?)
              AND m.empresa_uuid = UUID_TO_BIN(?)
              AND itc.deletado_em IS NOT NULL;
        `, [componente_uuid, instancia_uuid, empresa_uuid]);

        // 2. Exclui o vínculo entre o componente e a instância
        const [resultado] = await connection.execute(`
            DELETE itc
            FROM instancia_tem_componente itc
            JOIN instancia i
                ON itc.instancia_uuid = i.uuid
            JOIN microsservico m
                ON i.microsservico_uuid = m.uuid
            WHERE itc.componente_uuid = UUID_TO_BIN(?)
              AND itc.instancia_uuid = UUID_TO_BIN(?)
              AND m.empresa_uuid = UUID_TO_BIN(?)
              AND itc.deletado_em IS NOT NULL;
        `, [componente_uuid, instancia_uuid, empresa_uuid]);

        return resultado;
    });
};




const deleteUser = async (usuario_uuid, empresa_uuid) => {

    return await database.transaction(async (connection) => {

        // 1. Remove a referência do usuário nos alertas
        await connection.execute(`
            UPDATE alerta a
            SET a.resolvido_por = NULL
            WHERE a.resolvido_por = UUID_TO_BIN(?)
              AND a.empresa_uuid = UUID_TO_BIN(?);
        `, [usuario_uuid, empresa_uuid]);

        // 2. Exclui definitivamente o usuário
        const [resultado] = await connection.execute(`
            DELETE FROM usuario
            WHERE uuid = UUID_TO_BIN(?)
              AND empresa_uuid = UUID_TO_BIN(?)
              AND deletado_em IS NOT NULL;
        `, [usuario_uuid, empresa_uuid]);

        return resultado;
    });
};



const deleteVolume = async (volume_uuid, empresa_uuid) => {
    const query = `
        DELETE v
        FROM volume v
        JOIN instancia i
            ON v.instancia_uuid = i.uuid
        JOIN microsservico m
            ON i.microsservico_uuid = m.uuid
        WHERE v.uuid = UUID_TO_BIN(?)
          AND m.empresa_uuid = UUID_TO_BIN(?)
          AND v.deletado_em IS NOT NULL;
    `;

    const resultado = await database.execute(query, [
        volume_uuid,
        empresa_uuid
    ]);

    return resultado;
};


export default {
    getInstances,
    getMicrosservices,
    getComponentes,
    getUsuarios,
    getVolumes,
    deleteInstance,
    deleteMicroservice,
    deleteComponent,
    deleteUser,
    deleteVolume,
    restoreInstance,
    restoreMicroservice,
    restoreComponent,
    restoreUser,
    restoreVol
};
