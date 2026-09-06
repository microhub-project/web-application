const database = require("../database/config")

const getNameById = async (id) => {
  const query = "select nome_fantasia from empresa where id = ? and deletado_em is null"

  return await database.execute(query, [id])
}

module.exports = {
  getNameById
}