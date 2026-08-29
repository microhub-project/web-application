var usuarioModel = require("../models/usuario.model");
const codeModel = require("../models/code.model")

function autenticar(req, res) {
  var email = req.body.emailServer;
  var senha = req.body.senhaServer;

  if (email == undefined) {
    res.status(400).send("Seu email está undefined!");
  } else if (senha == undefined) {
    res.status(400).send("Sua senha está indefinida!");
  } else {

    usuarioModel.autenticar(email, senha)
      .then(
        function (resultadoAutenticar) {
          console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
          console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

          if (resultadoAutenticar.length == 1) {
            res.status(200).json(resultadoAutenticar);

          } else if (resultadoAutenticar.length == 0) {
            res.status(403).send("Email e/ou senha inválido(s)");
          } else {
            res.status(403).send("Mais de um usuário com o mesmo login e senha!");
          }
        }
      ).catch(
        function (erro) {
          console.log(erro);
          console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
          res.status(500).json(erro.sqlMessage);
        }
      );
  }

}

async function cadastrar(req, res) {
  // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
  const { name, password, code, email } = req.body
  const responseBody = {
    message: ""
  }
  // Faça as validações dos valores
  if (!name) {
    responseBody.message = "Nome inválido"
    res.status(400).json(responseBody);
  } else if (!email) {
    responseBody.message = "Email inválido"
    res.status(400).json(responseBody);
  } else if (!password) {
    responseBody.message = "Senha inválido"
    res.status(400).json(responseBody);
  } else if (!code) {
    responseBody.message = "Código inválido"
    res.status(400).json(responseBody);
  } 

  const isEmailValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);

    if (!isEmailValid) {
      responseBody.message = "Informe um e-mail válido";
        return res.status(400).json(responseBody);
    }

    const codeResponse = await codeModel.getCompanyAndRoleByCode(code)
    
    if (!codeResponse || codeResponse.length === 0) {
      responseBody.message = "Seu código está inválido";
      return res.status(401).json(responseBody);
    }

    // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
    try {

      const responseUserModel = await usuarioModel.cadastrar(name, email, password, codeResponse[0].cargo, codeResponse[0].empresa_id)

      if (responseUserModel.affectedRows !== 1) {
        responseBody.message = "Não foi possível cadastrar o usuário. Tente novamente mais tarde"
        res.status(500).json(responseBody)
      }

      responseBody.message = "Cadastro realizado com sucesso! Faça login para prosseguir"
      res.status(201).json(responseBody)
      
    } catch (e) {
      console.error(e)
      responseBody.message = "Algo deu errado. Tente novamente mais tarde"
      res.status(500).json(responseBody)
    }
  }

module.exports = {
  autenticar,
  cadastrar
}