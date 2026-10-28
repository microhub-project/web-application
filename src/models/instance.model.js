import database from "../database/config.js";

const create = async (uuid, nome, endereco_mac, tipo_uuid, microsservico_uuid) => {
  const query = `
    INSERT INTO instancia (uuid, nome, endereco_mac, tipo_uuid, status, microsservico_uuid) VALUES (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?), 1, UUID_TO_BIN(?));
  `;
  return await database.execute(query, [uuid, nome, endereco_mac, tipo_uuid, microsservico_uuid]);
};

const createVolume = async (uuid, armazenamento, instancia_uuid) => {
  const query = `
    INSERT INTO volume (uuid, armazenamento, custo_giga, instancia_uuid, status) VALUES (UUID_TO_BIN(?), ?, 0.15, UUID_TO_BIN(?), 1);
  `;
  return await database.execute(query, [uuid, armazenamento, instancia_uuid]);
};

const createInstanceComponent = async (componente_uuid, instancia_uuid, limite_maximo, limite_minimo, monitorado) => {
  const query = `
    INSERT INTO instancia_tem_componente (componente_uuid, instancia_uuid, limite_maximo, limite_minimo, monitorado, status) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, 1);
  `;
  return await database.execute(query, [componente_uuid, instancia_uuid, limite_maximo, limite_minimo, monitorado]);
};

const getAll = async (empresa_uuid) => {
  const query = `
    SELECT 
      BIN_TO_UUID(i.uuid) AS uuid, i.endereco_mac, i.nome,
      BIN_TO_UUID(m.uuid) AS microsservico_uuid, m.nome AS microsservico,
      BIN_TO_UUID(t.uuid) AS tipo_uuid, t.nome AS tipo, t.cpu, t.ram, t.custo_computacao,
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
  const query = "SELECT BIN_TO_UUID(uuid) AS uuid, armazenamento, custo_giga FROM volume WHERE instancia_uuid = UUID_TO_BIN(?) AND deletado_em IS NULL;";
  return await database.execute(query, [instancia_uuid]);
};

const getComponents = async () => {
  const query = "SELECT BIN_TO_UUID(uuid) AS uuid, nome, nome_tecnico, unidade_medida FROM componente ORDER BY nome;";
  return await database.execute(query, []);
};

const getTypes = async () => {
  const query = "SELECT BIN_TO_UUID(uuid) AS uuid, nome, cpu, ram, custo_computacao FROM tipo ORDER BY cpu;";
  return await database.execute(query, []);
};

const getMonitoredComponents = async (instancia_uuid) => {
  const query = "SELECT BIN_TO_UUID(componente_uuid) AS componente_uuid, BIN_TO_UUID(instancia_uuid) AS instancia_uuid, limite_maximo, limite_minimo, monitorado, status FROM instancia_tem_componente WHERE instancia_uuid = UUID_TO_BIN(?) AND monitorado = 1;";
  return await database.execute(query, [instancia_uuid]);
};

const deleteInstance = async (instancia_uuid) => {
  const query = "UPDATE instancia SET status = 2, deletado_em = CURRENT_TIMESTAMP() WHERE uuid = UUID_TO_BIN(?);";
  return await database.execute(query, [instancia_uuid]);
};

const deleteInstanceComponent = async (instancia_uuid) => {
  const query = "UPDATE instancia_tem_componente SET status = 2, deletado_em = CURRENT_TIMESTAMP() WHERE instancia_uuid = UUID_TO_BIN(?);";
  return await database.execute(query, [instancia_uuid]);
};

const deleteInstanceVolume = async (instancia_uuid) => {
  const query = "UPDATE volume SET status = 2, deletado_em = CURRENT_TIMESTAMP() WHERE instancia_uuid = UUID_TO_BIN(?);";
  return await database.execute(query, [instancia_uuid]);
};

const deleteVolume = async (uuid) => {
  const query = "UPDATE volume SET status = 2, deletado_em = CURRENT_TIMESTAMP() WHERE uuid = UUID_TO_BIN(?);";
  return await database.execute(query, [uuid]);
};

const update = async (nome, endereco_mac, tipo_uuid, microsservico_uuid, uuid) => {
  const query = `
    UPDATE instancia SET nome = ?, endereco_mac = ?, tipo_uuid = UUID_TO_BIN(?), microsservico_uuid = UUID_TO_BIN(?), atualizado_em = CURRENT_TIMESTAMP() WHERE uuid = UUID_TO_BIN(?);
  `;
  return await database.execute(query, [nome, endereco_mac, tipo_uuid, microsservico_uuid, uuid]);
};

const updateInstanceComponent = async (limite_maximo, limite_minimo, monitorado, componente_uuid, instancia_uuid) => {
  const query = `
    UPDATE instancia_tem_componente SET limite_maximo = ?, limite_minimo = ?, monitorado = ?, atualizado_em = CURRENT_TIMESTAMP() WHERE componente_uuid = UUID_TO_BIN(?) AND instancia_uuid = UUID_TO_BIN(?);
  `;
  return await database.execute(query, [limite_maximo, limite_minimo, monitorado, componente_uuid, instancia_uuid]);
};

export default {
  create,
  createVolume,
  createInstanceComponent,
  getAll,
  getComponents,
  getMonitoredComponents,
  getVolumes,
  getTypes,
  deleteInstance,
  deleteInstanceComponent,
  deleteInstanceVolume,
  deleteVolume,
  update,
  updateInstanceComponent
};