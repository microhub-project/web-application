import database from "../database/config.js";

const getNameByUUID = async (uuid) => {
  const query = "SELECT nome_fantasia FROM empresa WHERE uuid = UUID_TO_BIN(?) AND status = 1";
  return await database.execute(query, [uuid]);
};

export default {
  getNameByUUID
};