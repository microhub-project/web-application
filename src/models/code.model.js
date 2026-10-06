import database from "../database/config.js";

const create = async (code, companyId, role) => {
  const query = "insert into codigo_ativacao (codigo, cargo, empresa_id, expira_em) values (?, ?, ?, date_add(current_timestamp(), interval 15 minute))";

  return await database.execute(query, [code, role, companyId]);
};

const getCompanyAndRoleByCode = async (code) => {
  const query = "select c.codigo, c.cargo, c.empresa_id, c.expira_em, e.nome_fantasia from codigo_ativacao c join empresa e on c.empresa_id = e.id where c.codigo = ? and c.expira_em > current_timestamp() and c.deletado_em is null and c.usado_em is null";

  return await database.execute(query, [code]);
};

const setCodeUsedByCode = async (code) => {
  const query = "update codigo_ativacao set usado_em = current_timestamp() where codigo = ?";

  return await database.execute(query, [code]);
};

const updateRoleById = async (id, role) => {
  const query = "update codigo_ativacao set cargo = ?, atualizado_em = current_timestamp() where id = ?";

  return await database.execute(query, [role, id]);
};

const updateExpiresAtById = async (id) => {
  const query = "update codigo_ativacao set expira_em = date_add(current_timestamp(), interval 15 minute), atualizado_em = current_timestamp() where id = ?";

  return await database.execute(query, [id]);
};

const getCodeDataByCodeId = async (id) => {
  const query = "select e.nome_fantasia, ca.cargo, ca.codigo from empresa e join codigo_ativacao ca on ca.empresa_id = e.id where ca.id = ? and ca.expira_em > current_timestamp() and ca.deletado_em is null and ca.usado_em is null";

  return await database.execute(query, [id]);
};

const disableCodeById = async (id) => {
  const query = "update codigo_ativacao set deletado_em = current_timestamp() where id = ? and deletado_em is null";

  return await database.execute(query, [id]);
};

const getAllCodesByUserAndCompanyId = async (userId, companyId) => {
  const query = "select c.id, c.codigo, c.cargo, c.criado_em, c.expira_em, c.usado_em, c.atualizado_em, c.deletado_em from codigo_ativacao c join empresa e on c.empresa_id = e.id join usuario u on u.empresa_id = e.id where u.id = ? and u.cargo = 1 and e.id = ? and c.deletado_em is null";

  return await database.execute(query, [userId, companyId]);
};

export default {
  create,
  getCompanyAndRoleByCode,
  setCodeUsedByCode,
  updateRoleById,
  updateExpiresAtById,
  getCodeDataByCodeId,
  disableCodeById,
  getAllCodesByUserAndCompanyId
};