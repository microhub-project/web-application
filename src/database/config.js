import mysql from "mysql2/promise";

// CONEXÃO DO BANCO MYSQL SERVER
const mySqlConfig = {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
};

// Criamos o pool uma única vez fora da função para reusar conexões
const poolDB = mysql.createPool(mySqlConfig);

async function execute(query, params) {
  const [rows] = await poolDB.execute(query, params);
  console.log(rows);
  return rows;
}

export default {
  execute
};