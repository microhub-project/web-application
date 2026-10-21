import database from "../database/config.js";

const create = async (uuid) => {
  const query = `
    INSERT INTO instancia (uuid, endereco_mac, tipo_uuid, custo_mensal, status, microsservico_uuid) VALUES (UUID_TO_BIN(?), ?, UUID_TO_BIN(?), ?, 1, UUID_TO_BIN(?));
    INSERT INTO instancia_tem_componente (componente_uuid, instancia_uuid, limite_maximo, limite_minimo, monitorado, status) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, 1);
    INSERT INTO volume (uuid, armazenamento, custo_giga, instancia_uuid, status) VALUES (UUID_TO_BIN(?), ?, 0.15, UUID_TO_BIN(?), 1);
  `;
  return await database.execute(query, [uuid]);
};

const getAll = async (empresa_uuid) => {
  const query = `
    SELECT 
      BIN_TO_UUID(i.uuid) AS uuid, i.endereco_mac, i.nome,
      m.nome AS microsservico, 
      t.nome AS tipo, t.cpu, t.ram, t.custo_computacao,
      IFNULL(ROUND(v.custo_total, 2), 0) AS custo_armazenamento,
      (t.custo_computacao + IFNULL(ROUND(v.custo_total, 2), 0)) AS custo_mensal
    FROM instancia i 
    JOIN microsservico m ON i.microsservico_uuid = m.uuid 
    JOIN tipo t ON i.tipo_uuid = t.uuid
    LEFT JOIN (
      SELECT instancia_uuid, SUM(custo_giga * armazenamento) AS custo_total
      FROM volume
      GROUP BY instancia_uuid
    ) v ON v.instancia_uuid = i.uuid
    WHERE m.empresa_uuid = UUID_TO_BIN(?) 
      AND m.deletado_em IS NULL 
      AND i.deletado_em IS NULL;
  `;
  return await database.execute(query, [empresa_uuid]);
};

const getVolumes = async (instancia_uuid) => {
  const query = "SELECT BIN_TO_UUID(uuid) AS uuid, armazenamento, custo_giga FROM volume WHERE instancia_uuid = UUID_TO_BIN(?);";
  return await database.execute(query, [instancia_uuid]);
};

const getComponents = async () => {
  const query = "SELECT * FROM componente;";
  return await database.execute(query, []);
};

const getInstanceComponents  = async (instancia_uuid) => {
  const query = "SELECT * FROM instancia_tem_componente WHERE instancia_uuid = UUID_TO_BIN(?);";
  return await database.execute(query, [instancia_uuid]);
};

export default {
  create,
  getAll,
  getComponents,
  getInstanceComponents,
  getVolumes
};