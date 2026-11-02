import path from "path";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config({ path: path.resolve(process.cwd(), ".env.dev") });

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

// Executa várias consultas dentro de uma transação
async function transaction(callback) {
  const connection = await poolDB.getConnection();

  try {
    await connection.beginTransaction();

    const resultado = await callback(connection);

    await connection.commit();

    return resultado;

  } catch (erro) {
    await connection.rollback();
    throw erro;

  } finally {
    connection.release();
  }
}

export default {
  execute,
  transaction
};