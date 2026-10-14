import database from "../database/config.js";

const create = async (uuid, code, companyUUID, role) => {
  const query = "INSERT INTO codigo_ativacao (uuid, codigo, cargo, empresa_uuid, expira_em, status) VALUES (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?), DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 15 MINUTE), 1)";
  return await database.execute(query, [uuid, code, role, companyUUID]);
};

const getCompanyAndRoleByCode = async (code) => {
  const query = "SELECT c.codigo, c.cargo, BIN_TO_UUID(c.empresa_uuid) AS empresa_uuid, c.expira_em, e.nome_fantasia FROM codigo_ativacao c JOIN empresa e ON c.empresa_uuid = e.uuid WHERE c.codigo = ? AND c.expira_em > CURRENT_TIMESTAMP() AND c.deletado_em IS NULL AND c.usado_em IS NULL";
  return await database.execute(query, [code]);
};

const setCodeUsedByCode = async (code) => {
  const query = "UPDATE codigo_ativacao SET usado_em = CURRENT_TIMESTAMP() WHERE codigo = ?";
  return await database.execute(query, [code]);
};

const updateRoleByUUID = async (uuid, role) => {
  const query = "UPDATE codigo_ativacao SET cargo = ?, atualizado_em = CURRENT_TIMESTAMP() WHERE uuid = UUID_TO_BIN(?)";
  return await database.execute(query, [role, uuid]);
};

const updateExpiresAtByUUID = async (uuid) => {
  const query = "UPDATE codigo_ativacao SET expira_em = DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 15 MINUTE), atualizado_em = CURRENT_TIMESTAMP() WHERE uuid = UUID_TO_BIN(?)";
  return await database.execute(query, [uuid]);
};

const getCodeDataByCodeUUID = async (uuid) => {
  const query = "SELECT e.nome_fantasia, ca.cargo, ca.codigo FROM empresa e JOIN codigo_ativacao ca ON ca.empresa_uuid = e.uuid WHERE ca.uuid = UUID_TO_BIN(?) AND ca.expira_em > CURRENT_TIMESTAMP() AND ca.deletado_em IS NULL AND ca.usado_em IS NULL";
  return await database.execute(query, [uuid]);
};

const disableCodeByUUID = async (uuid) => {
  const query = "UPDATE codigo_ativacao SET deletado_em = CURRENT_TIMESTAMP() WHERE uuid = UUID_TO_BIN(?) AND deletado_em IS NULL";
  return await database.execute(query, [uuid]);
};

const getAllCodesByUserAndCompanyUUID = async (userUUID, companyUUID) => {
  const query = "SELECT BIN_TO_UUID(c.uuid) AS uuid, c.codigo, c.cargo, c.criado_em, c.expira_em, c.usado_em, c.atualizado_em, c.deletado_em FROM codigo_ativacao c JOIN empresa e ON c.empresa_uuid = e.uuid JOIN usuario u ON u.empresa_uuid = e.uuid WHERE u.uuid = UUID_TO_BIN(?) AND u.cargo = 1 AND e.uuid = UUID_TO_BIN(?) AND c.deletado_em IS NULL";
  return await database.execute(query, [userUUID, companyUUID]);
};

export default {
  create,
  getCompanyAndRoleByCode,
  setCodeUsedByCode,
  updateRoleByUUID,
  updateExpiresAtByUUID,
  getCodeDataByCodeUUID,
  disableCodeByUUID,
  getAllCodesByUserAndCompanyUUID
};