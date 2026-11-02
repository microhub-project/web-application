import database from "../database/config.js";

const getInstances = async (empresa_uuid) => {
  const query = `
    SELECT 
      BIN_TO_UUID(i.uuid) AS uuid, i.endereco_mac, i.nome,
      m.nome AS microsservico, 
      i.deletado_em,
      i.criado_em,
      t.nome AS tipo, t.custo_computacao,
      IFNULL(ROUND(v.custo_total, 2), 0) AS custo_armazenamento,
      (t.custo_computacao + IFNULL(ROUND(v.custo_total, 2), 0)) AS custo_mensal
    FROM instancia i 
    LEFT JOIN microsservico m ON i.microsservico_uuid = m.uuid 
    JOIN tipo t ON i.tipo_uuid = t.uuid
    LEFT JOIN (
      SELECT instancia_uuid, SUM(custo_giga * armazenamento) AS custo_total
      FROM volume
      GROUP BY instancia_uuid
    ) v ON v.instancia_uuid = i.uuid
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

const deleteInstance  = async (instancia_uuid) => {
  const query = "DELETE instancia WHERE uuid = UUID_TO_BIN(?);";
  return await database.execute(query, [instancia_uuid]);
};


export default {
  getInstances,
  deleteInstance,
  getMicrosservices,
  getComponentes,
  getUsuarios,
  getVolumes
};