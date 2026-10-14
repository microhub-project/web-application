import database from "../database/config.js";

function autenticar(email) {
  const instrucaoSql = `
    SELECT BIN_TO_UUID(u.uuid) AS uuid, u.nome, u.email, u.cargo, u.senha, BIN_TO_UUID(u.empresa_uuid) AS empresa_uuid, e.nome_fantasia 
    FROM usuario u 
    JOIN empresa e ON u.empresa_uuid = e.uuid 
    WHERE u.email = ? AND u.deletado_em IS NULL;
  `;
  return database.execute(instrucaoSql, [email]);
}

function cadastrar(uuid, nome, email, senha, cargo, empresaUUID) {
  const instrucaoSql = `
    INSERT INTO usuario (uuid, nome, email, senha, cargo, empresa_uuid, status) 
    VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, UUID_TO_BIN(?), 1);
  `;
  return database.execute(instrucaoSql, [uuid, nome, email, senha, cargo, empresaUUID]);
}

function buscarPorUUID(uuid) {
  const instrucaoSql = `
    SELECT BIN_TO_UUID(uuid) AS uuid, nome, email, cargo
    FROM usuario
    WHERE uuid = UUID_TO_BIN(?);
  `;
  return database.execute(instrucaoSql, [uuid]);
}

function listar(userUUID) { 
  const instrucaoSql = ` 
    SELECT BIN_TO_UUID(u.uuid) AS uuid, u.nome, u.cargo, BIN_TO_UUID(u.empresa_uuid) AS empresa_uuid
    FROM usuario u 
    JOIN empresa e ON u.empresa_uuid = e.uuid
    WHERE u.empresa_uuid = (
      SELECT e2.uuid 
      FROM empresa e2 
      JOIN usuario u2 ON u2.empresa_uuid = e2.uuid
      WHERE u2.uuid = UUID_TO_BIN(?) AND u2.cargo = 1 AND u2.deletado_em IS NULL
    ) AND u.deletado_em IS NULL;
  `; 
  return database.execute(instrucaoSql, [userUUID]); 
}

function pesquisar(nome) {
  const instrucaoSql = `
    SELECT BIN_TO_UUID(uuid) AS uuid, nome, cargo
    FROM usuario
    WHERE nome LIKE ?
    AND deletado_em IS NULL;
  `;
  return database.execute(instrucaoSql, [`%${nome}%`]);
}

function atualizar(uuid, nome, email, cargo) {
  if (nome) {
    const instrucaoSql = `
      UPDATE usuario
      SET nome = ?, atualizado_em = CURRENT_TIMESTAMP()
      WHERE uuid = UUID_TO_BIN(?);
    `;
    return database.execute(instrucaoSql, [nome, uuid]);
  }

  if (email) {
    const instrucaoSql = `
      UPDATE usuario
      SET email = ?, atualizado_em = CURRENT_TIMESTAMP()
      WHERE uuid = UUID_TO_BIN(?);
    `;
    return database.execute(instrucaoSql, [email, uuid]);
  }

  if (cargo !== undefined) {
    const instrucaoSql = `
      UPDATE usuario
      SET cargo = ?, atualizado_em = CURRENT_TIMESTAMP()
      WHERE uuid = UUID_TO_BIN(?);
    `;
    return database.execute(instrucaoSql, [cargo, uuid]);
  }
}

function excluir(uuid) {
  const instrucaoSql = `
    UPDATE usuario
    SET deletado_em = CURRENT_TIMESTAMP()
    WHERE uuid = UUID_TO_BIN(?);
  `;
  return database.execute(instrucaoSql, [uuid]);
}

export default {
  autenticar,
  cadastrar,
  buscarPorUUID,
  listar,
  pesquisar,
  atualizar,
  excluir
};