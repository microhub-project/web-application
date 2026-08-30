var usuarioModel = require("../models/usuario.model");
const codeModel = require("../models/code.model")

async function autenticar(req, res) {
  const { password, email } = req.body
  const responseBody = {
    message: "",
    body: {}
  }

  if (!email) {
    responseBody.message = "Email inválido"
    return res.status(400).json(responseBody);
  } else if (!password) {
    responseBody.message = "Senha inválido"
    return res.status(400).json(responseBody);
  } 
  
  try {
    const responseUserModel = await usuarioModel.autenticar(email, password)

    if (responseUserModel.length !== 1) {
      responseBody.message = "Email e/ou senha inválido(s)"
      return res.status(403).json(responseBody)
    }

    responseBody.message = "Login realizado com sucesso! Redirecionando para dashboard..."
    responseBody.body = responseUserModel[0]

    return res.status(200).json(responseBody)

  } catch (e) {
    console.error(e)
    responseBody.message = "Algo deu errado. Tente novamente mais tarde"
    return res.status(500).json(responseBody)
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

    try {
      const codeResponse = await codeModel.getCompanyAndRoleByCode(code)
      
      if (!codeResponse || codeResponse.length === 0) {
        responseBody.message = "Seu código está inválido";
        return res.status(401).json(responseBody);
      }

      const responseUserModel = await usuarioModel.cadastrar(name, email, password, codeResponse[0].cargo, codeResponse[0].empresa_id)

      if (responseUserModel.affectedRows !== 1) {
        responseBody.message = "Não foi possível cadastrar o usuário. Tente novamente mais tarde"
        res.status(500).json(responseBody)
      }

      const codeUpdateResponse = await codeModel.setCodeUsedByCode(code)

      if (codeUpdateResponse.affectedRows !== 1) {
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