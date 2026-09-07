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


  async function buscarPorId(req, res) {
    const id = req.params.id;
    try {
        const resultado = await usuarioModel.buscarPorId(id);
        if (resultado[0].length != 1) {
            return res.status(404).json({
                message: "Usuário não encontrado"
            });
        }

        return res.status(200).json(resultado[0][0]);

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao buscar usuário"
        });
    }
}


async function listar(req, res) {
    try {
        const resultado = await usuarioModel.listar();
        console.log("RESULTADO:", resultado);
        return res.status(200).json(resultado);
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar usuários"
        });
    }
}


async function pesquisar(req, res) {
    const nome = req.params.nome;
    try {
        const resultado = await usuarioModel.pesquisar(nome);
        console.log("PESQUISA:", resultado);
        return res.status(200).json(resultado);
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao pesquisar usuários"
        });
    }
}


async function atualizar(req, res) {

    const id = req.params.id;
    const { nome, email, cargo } = req.body;

    try {

        const resultado = await usuarioModel.atualizar(
            id,
            nome,
            email,
            cargo
        );

        if (resultado.affectedRows != 1) {
            return res.status(400).json({
                message: "Usuário não encontrado"
            });
        }

        return res.status(200).json({
            message: "Usuário atualizado com sucesso!"
        });

    } catch (e) {

        console.error(e);

        return res.status(500).json({
            message: "Erro ao atualizar usuário"
        });

    }
}


async function excluir(req, res) {
    const id = req.params.id;

    try {
        const resultado = await usuarioModel.excluir(id);
        if (resultado.affectedRows != 1) {
            return res.status(400).json({
                message: "Usuário não encontrado"
            });
        }
        return res.status(200).json({
            message: "Usuário excluído com sucesso!"
        });
    } catch (e) {
        console.error(e);

        return res.status(500).json({
            message: "Erro ao excluir usuário"
        });
    }
}


module.exports = {
  autenticar,
  cadastrar,
  buscarPorId,
  listar,
  pesquisar,
  atualizar,
  excluir
}