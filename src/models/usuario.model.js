var database = require("../database/config")

function autenticar(email, senha) {
  console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)

  var instrucaoSql = `
        SELECT u.id, u.nome, u.email, u.cargo, u.empresa_id, e.nome_fantasia FROM usuario u JOIN empresa e ON u.empresa_id = e.id WHERE email = ? AND senha = AES_ENCRYPT(?, ?) AND u.deletado_em is NULL AND e.deletado_em is NULL;
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.execute(instrucaoSql, [email, senha, process.env.SECRET_KEY]);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nome, email, senha, cargo, empresaId) {
  console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, cargo, empresaId);

  // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
  //  e na ordem de inserção dos dados.
  var instrucaoSql = `
        INSERT INTO usuario (nome, email, cargo, empresa_id, senha) VALUES (?, ?, ?, ?, AES_ENCRYPT(?, ?));
    `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.execute(instrucaoSql, [nome, email, cargo, empresaId, senha, process.env.SECRET_KEY]);
}


function buscarPorId(id) {
    var instrucaoSql = `
        SELECT id, nome, email, cargo
        FROM usuario
        WHERE id = ?;
    `;
    return database.execute(instrucaoSql, [id]);
}


function listar(userId) { 
    var instrucaoSql = ` 
        SELECT u.id, u.nome, u.cargo 
        FROM usuario u JOIN empresa e 
        ON u.empresa_id = e.id
        WHERE u.empresa_id = (
          SELECT e2.id 
          FROM empresa e2 JOIN usuario u2
          ON u2.empresa_id = e2.id
          WHERE u2.id = ? AND u2.cargo = 1 AND u2.deletado_em IS NULL AND e2.deletado_em IS NULL
        ) AND u.deletado_em IS NULL
    `; 
    return database.execute(instrucaoSql, [userId]); 
}


function pesquisar(nome) {

    var instrucaoSql = `
        SELECT id, nome, cargo
        FROM usuario
        WHERE nome LIKE ?;
    `;

    return database.execute(instrucaoSql, [`%${nome}%`]);
}


function atualizar(id, nome, email, cargo) {

    let instrucaoSql = "";

    if (nome) {

        instrucaoSql = `
            UPDATE usuario
            SET nome = ?, atualizado_em = current_timestamp()
            WHERE id = ?;
        `;

        return database.execute(instrucaoSql, [nome, id]);
    }

    if (email) {

        instrucaoSql = `
            UPDATE usuario
            SET email = ?, atualizado_em = current_timestamp()
            WHERE id = ?;
        `;

        return database.execute(instrucaoSql, [email, id]);
    }

    if (cargo !== undefined) {

        instrucaoSql = `
            UPDATE usuario
            SET cargo = ?, atualizado_em = current_timestamp()
            WHERE id = ?;
        `;

        return database.execute(instrucaoSql, [cargo, id]);
    }
}


function excluir(id) {

    var instrucaoSql = `
        UPDATE usuario
        SET deletado_em = current_timestamp()
        WHERE id = ?;
    `;

    return database.execute(instrucaoSql, [id]);
}




module.exports = {
  autenticar,
  cadastrar,
  buscarPorId,
  listar,
  pesquisar,
  atualizar,
  excluir
};