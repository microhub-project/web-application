import database from "../database/config.js";

const getNameByUUID = async (uuid) => {
  const query = "SELECT nome_fantasia FROM empresa WHERE uuid = ? AND deletado_em IS NULL";

  return await database.execute(query, [uuid]);
};

export default {
  getNameByUUID
};