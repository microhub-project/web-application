import model from "../models/reports.model.js"

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

async function getGeralInst(req, res) {
    const empresaUUID = req.companyUUID;

    if (!empresaUUID) {
        return res.status(401).json({
            message: "Empresa não identificada."
        });
    }

    try {
        const resultado = await model.getGeralInst(empresaUUID);

        return res.status(200).json({ data: resultado });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar as instâncias"
        });
    }
}

async function getTotalAlertas(req, res) {
    const empresaUUID = req.companyUUID;

    if (!empresaUUID) {
        return res.status(401).json({
            message: "Empresa não identificada."
        });
    }

    try {
        const resultado = await model.getTotalAlertas(empresaUUID);

        return res.status(200).json({ data: resultado });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar as instâncias"
        });
    }
}

async function getRankingAlertas(req, res) {
    const empresaUUID = req.companyUUID;

    if (!empresaUUID) {
        return res.status(401).json({
            message: "Empresa não identificada."
        });
    }

    try {
        const resultado = await model.getRankingAlertas(empresaUUID);

        return res.status(200).json({ data: resultado });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar as instâncias"
        });
    }
}

export default {
  listarFunc,
  getGeralInst,
  getTotalAlertas,
  getRankingAlertas
};