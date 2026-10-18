import database from "../database/config.js";

const getAll = async (uuid) => {
  const query = "";
  return await database.execute(query, [uuid]);
};

export default {
  getAll
};