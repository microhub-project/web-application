const { sendVerificationCode } = require("./mailer.controller");

const generateCode = async (req, res) => {
    const { email, empresaId, empresaNome, cargo } = req.body;

    const responseBody = {
        isError: true,
        message: "Não foi possível enviar o código."
    };

    if (!email || !empresaId || !cargo) {
        responseBody.message = "E-mail, empresa e cargo são obrigatórios.";
        return res.status(400).json(responseBody);
    }


    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValido) {
        responseBody.message = "Informe um e-mail válido.";
        return res.status(400).json(responseBody);
    }


    try {
        // Código 6 dígitos
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Expira em 10 min
        const expiraEm = new Date(Date.now() + 10 * 60 * 1000);


        const infoEmail = await sendVerificationCode(email, code, empresaNome, cargo);
        
        if (infoEmail.rejected && infoEmail.rejected.length > 0) {
            responseBody.message = "Não foi possível enviar o e-mail.";
            return res.status(500).json(responseBody);
        }


        // Salvar no banco
        await Codigo.create({
            email: email,
            codigo: code,
            empresaId: empresaId,
            expiraEm: expiraEm,
            cargo: cargo
        });

        responseBody.isError = false;
        responseBody.message = "Código enviado com sucesso!";

        return res.status(200).json(responseBody);


    } catch {
        responseBody.message =
            "Algo deu errado. Tente novamente mais tarde.";

        return res.status(500).json(responseBody);
    }
};