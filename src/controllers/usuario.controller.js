import usuarioModel from "../models/usuario.model.js";
import codeModel from "../models/code.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function autenticar(req, res) {
  const { password, email } = req.body;
  const responseBody = {
    message: "",
    body: {}
  };

  if (!email) {
    responseBody.message = "Email inválido";
    return res.status(400).json(responseBody);
  } else if (!password) {
    responseBody.message = "Senha inválida";
    return res.status(400).json(responseBody);
  }

  try {
    const usuarios = await usuarioModel.autenticar(email);

    if (!usuarios || usuarios.length !== 1) {
      responseBody.message = "Email e/ou senha inválido(s)";
      return res.status(401).json(responseBody);
    }

    const usuario = usuarios[0];

    const passwordValidation = await bcrypt.compare(password, usuario.senha);

    if (!passwordValidation) {
      responseBody.message = "Email e/ou senha inválido(s)";
      return res.status(401).json(responseBody);
    }

    delete usuario.senha;
    
    const token = jwt.sign(
      { 
        userUUID: usuario.uuid, 
        name: usuario.nome,
        email: usuario.email,
        companyUUID: usuario.empresa_uuid,
        cargo: usuario.cargo
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    responseBody.message = "Login realizado com sucesso! Redirecionando para dashboard...";
    responseBody.body = {
      usuario: usuario,
      auth: true,
      token: token
    };

    return res.status(200).json(responseBody);

  } catch (e) {
    console.error(e);
    responseBody.message = "Algo deu errado. Tente novamente mais tarde";
    return res.status(500).json(responseBody);
  }
}

async function cadastrar(req, res) {
  const { name, password, code, email } = req.body;
  const responseBody = {
    message: ""
  };

  // Validações dos valores (com 'return' para interromper a execução caso falhe)
  if (!name) {
    responseBody.message = "Nome inválido";
    return res.status(400).json(responseBody);
  } else if (!email) {
    responseBody.message = "Email inválido";
    return res.status(400).json(responseBody);
  } else if (!password) {
    responseBody.message = "Senha inválido";
    return res.status(400).json(responseBody);
  } else if (!code) {
    responseBody.message = "Código inválido";
    return res.status(400).json(responseBody);
  }

  const isEmailValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);

  if (!isEmailValid) {
    responseBody.message = "Informe um e-mail válido";
    return res.status(400).json(responseBody);
  }

  try {
    const codeResponse = await codeModel.getCompanyAndRoleByCode(code);

    if (!codeResponse || codeResponse.length === 0) {
      responseBody.message = "Seu código está inválido";
      return res.status(401).json(responseBody);
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log(password)
    console.log(hashedPassword)

    const uuid = crypto.randomUUID();

    const responseUserModel = await usuarioModel.cadastrar(uuid, name, email, hashedPassword, codeResponse[0].cargo, codeResponse[0].empresa_uuid);

    if (responseUserModel.affectedRows !== 1) {
      responseBody.message = "Não foi possível cadastrar o usuário. Tente novamente mais tarde";
      return res.status(500).json(responseBody);
    }

    const codeUpdateResponse = await codeModel.setCodeUsedByCode(code);

    if (codeUpdateResponse.affectedRows !== 1) {
      responseBody.message = "Não foi possível cadastrar o usuário. Tente novamente mais tarde";
      return res.status(500).json(responseBody);
    }

    responseBody.message = "Cadastro realizado com sucesso! Faça login para prosseguir";
    return res.status(201).json(responseBody);

  } catch (e) {
    console.error(e);
    responseBody.message = "Algo deu errado. Tente novamente mais tarde";
    return res.status(500).json(responseBody);
  }
}

async function buscarPorUUID(req, res) {
  const uuid = req.params.uuid;
  try {
    const resultado = await usuarioModel.buscarPorUUID(uuid);
    if (resultado[0].length !== 1) {
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
  const userUUID = req.params.uuid;

  if (!userUUID)
    return res.status(400).send();

  try {
    const resultado = await usuarioModel.listar(userUUID);
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
  const uuid = req.params.uuid;
  const { nome, email, cargo } = req.body;

  try {
    const resultado = await usuarioModel.atualizar(
      uuid,
      nome,
      email,
      cargo
    );

    if (resultado.affectedRows !== 1) {
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
  const uuid = req.params.uuid;

  try {
    const resultado = await usuarioModel.excluir(uuid);
    if (resultado.affectedRows !== 1) {
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

export default {
  autenticar,
  cadastrar,
  buscarPorUUID,
  excluir,
  atualizar,
  pesquisar,
  listar
};