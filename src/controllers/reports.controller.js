import model from "../models/reports.model"

async function listarFunc(req, res) {
    const empresaUUID = req.companyUUID;

    if (!empresaUUID) {
        return res.status(401).json({
            message: "Empresa não identificada."
        });
    }

    try {
        const resultado = await model.getGeralFunc(empresaUUID);

        return res.status(200).json({ data: resultado });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar os funcionários"
        });
    }
}