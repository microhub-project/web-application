import database from "../database/config.js";

const create = async (uuid, empresa_uuid, nome, descricao) => {
  const query = "INSERT INTO microsservico (uuid, empresa_uuid, nome, descricao, status) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, 1)";
  return await database.execute(query, [uuid, empresa_uuid, nome, descricao]);
};

const getAll = async (empresa_uuid) => {
  const query = `
    SELECT 
        BIN_TO_UUID(m.uuid) AS uuid, 
        m.nome, 
        m.descricao, 
        i.endereco_mac 
    FROM microsservico m 
    LEFT JOIN instancia i 
        ON i.microsservico_uuid = m.uuid 
        AND i.deletado_em IS NULL
    WHERE m.empresa_uuid = UUID_TO_BIN(?) 
        AND m.deletado_em IS NULL;
  `;
  return await database.execute(query, [empresa_uuid]);
};

const deleteMicroservice = async (uuid) => {
  const query = "UPDATE microsservico SET status = 2, deletado_em = CURRENT_TIMESTAMP() WHERE uuid = UUID_TO_BIN(?);";
  return await database.execute(query, [uuid]);
};

const updateMicroservice = async (nome, descricao, uuid) => {
  const query = "UPDATE microsservico SET nome = ?, descricao = ?, atualizado_em = CURRENT_TIMESTAMP() WHERE uuid = UUID_TO_BIN(?);";
  return await database.execute(query, [nome, descricao, uuid]);
};

export default {
  create,
  getAll,
  deleteMicroservice,
  updateMicroservice
};