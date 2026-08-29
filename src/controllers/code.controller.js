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

module.exports = {
  sendCode
}