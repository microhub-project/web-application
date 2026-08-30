const database = require("../database/config")

const create = async (code, companyId, role) => {
  const query = "insert into codigo_ativacao (codigo, cargo, empresa_id, expira_em) values (?, ?, ?, date_add(current_timestamp(), interval 15 minute))"

  return await database.execute(query, [code, role, companyId])
}

const getCompanyAndRoleByCode = async (code) => {
  const query = "select c.codigo, c.cargo, c.empresa_id, c.expira_em, e.nome_fantasia from codigo_ativacao c join empresa e on c.empresa_id = e.id where c.codigo = ? and c.expira_em > current_timestamp() and c.deletado_em is null and c.usado_em is null"

  return await database.execute(query, [code])
}

const setCodeUsedByCode = async (code) => {
  const query = "update codigo_ativacao set usado_em = current_timestamp() where codigo = ?"

  return await database.execute(query, [code])
}

module.exports = {
  create,
  getCompanyAndRoleByCode,
  setCodeUsedByCode
}