const mailerController = require("./mailer.controller");
const codeModel = require("../models/code.model")

const sendCode = async (req, res) => {
    const { email, companyId, role } = req.body; 
    const companyName = "Microhub" // está só para teste por enquanto

    const code = generateCode()

    const responseBody = {
        isError: true,
        message: "Não foi possível enviar o código."
    };
    console.log(email, companyId, role)

    if (!email || !companyId || role == null) {
      responseBody.message = "Credenciais inválidas.";
      return res.status(400).json(responseBody);
    }

    const isEmailValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);

    if (!isEmailValid) {
      responseBody.message = "Informe um e-mail válido.";
        return res.status(400).json(responseBody);
    }

    try {
        const infoEmail = await mailerController.sendVerificationCode(email, code, companyName, role);
        
        if (infoEmail.rejected && infoEmail.rejected.length > 0) {
            responseBody.message = "Não foi possível enviar o e-mail.";
            return res.status(500).json(responseBody);
        }

        codeModel.create(code, companyId, role)

        responseBody.isError = false;
        responseBody.message = "Código enviado com sucesso!";

        return res.status(200).json(responseBody);


    } catch {
        responseBody.message =
            "Algo deu errado. Tente novamente mais tarde.";

        return res.status(500).json(responseBody);
    }
};

const generateCode = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let code = ""

  for (let i = 0; i < 6; i++) {
    const random = Math.floor(Math.random() * 36)

    code += chars[random]
  }

  return code
}

const editCode = async (req, res) => {
  const { id, role, email, isRenewal } = req.body // é possível adicionar o companyId e o userId para fazer as queries com maior segurança

  const responseBody = {
    message: ""
  }

  if (!id) {
    responseBody.message = "Id do código está inválido"
    return res.status(400).json(responseBody)
  }

  if (!role && !isRenewal && !email) {
    responseBody.message = "Dados inválidos"
    return res.status(400).json(responseBody)
  }

  const isEmailValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
  if (email && !isEmailValid) {
    responseBody.message = "Email está inválido"
    return res.status(400).json(responseBody)
  }
  
  try {

    if (role !== null && typeof role !== "undefined") {
      console.log("cargo: " + role)
      const response = await codeModel.updateRoleById(id, role)

      if (response.affectedRows !== 1) {
        responseBody.message = "Não foi possível alterar o cargo relacionado ao código. Tente novamente mais tarde"
        return res.status(500).json(responseBody);
      } 

      responseBody.message = "O cargo do código foi alterado com sucesso"
      return res.status(200).json(responseBody)
    }

    else if (email !== null && typeof email !== "undefined" && email !== "") {
      console.log("email: " + email)
      const dbResponse = await codeModel.getCodeDataByCodeId(id)

      if (dbResponse.length !== 1) {
        responseBody.message = "Não foi possível encontrar o código de ativação";
        return res.status(500).json(responseBody);
      }

      console.log(dbResponse)
      const { cargo, nome_fantasia, codigo } = dbResponse[0]
      const mailerResponse = await mailerController.sendVerificationCode(email, codigo, nome_fantasia, cargo)

      if (mailerResponse.rejected && mailerResponse.rejected.length > 0) {
        responseBody.message = "Não foi possível enviar o e-mail. Tente novamente mais tarde";
        return res.status(500).json(responseBody);
      }

      responseBody.message = "O email foi reenviado com sucesso"
      return res.status(200).json(responseBody)
    }

    else if (isRenewal === true) {
      console.log("renovar? " + isRenewal)
      const response = await codeModel.updateExpiresAtById(id)

      if (response.affectedRows !== 1) {
        responseBody.message = "Não foi possível renovar data de expiração do código. Tente novamente mais tarde"
        return res.status(500).json(responseBody);
      } 

      responseBody.message = "A data de expiração do código foi renovado com sucesso"
      return res.status(200).json(responseBody)
    }

  } catch (e) {
    console.error(e)
    responseBody.message = "Algo deu errado. Tente novamente mais tarde"
    return res.status(500).json(responseBody);
  }
}

const disableCode = async (req, res) => {
  const { id } = req.body

  const responseBody = {
    message: "Id do código de ativação inválido"
  }

  if (!id) 
    return res.status(400).json(responseBody)

  try {
    const dbResponse = await codeModel.disableCodeById(id)
    console.log(dbResponse)
  
    if (dbResponse.affectedRows !== 1) {
      responseBody.message = "Código de ativação não encontrado"
      return res.status(404).json(responseBody)
    }

    responseBody.message = "Código de ativação foi desativado com sucesso"
    return res.status(200).json(responseBody)
    
  } catch (e) {
    console.error(e)
    responseBody.message = "Algo deu errado. Tente novamente mais tarde"
    return res.status(500).json(responseBody)
  }
  
}

module.exports = {
  sendCode,
  editCode,
  disableCode,
}