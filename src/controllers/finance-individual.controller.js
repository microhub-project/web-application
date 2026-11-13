import financeIndividualModel from "../models/finance-individual.model.js";

async function listarInstancias(req, res) {
    const empresaUUID = req.companyUUID;

    if (!empresaUUID) {
        return res.status(401).json({
            message: "Empresa não identificada."
        });
    }

    try {
        const resultado = await financeIndividualModel.getInstances(empresaUUID);

        return res.status(200).json({ data: resultado });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar instâncias."
        });
    }
}

async function listarItens(req, res) {
    const empresaUUID = req.companyUUID;
    const uuid = req.params.uuid;


    if (!uuid || !empresaUUID) {
        return res.status(401).json({
            message: "Dados inválidos."
        });
    }

    try {
        const resultado = await financeIndividualModel.getItens(uuid, empresaUUID);

        return res.status(200).json({ data: resultado });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar itens."
        });
    }
}

export default{
    listarInstancias,
    listarItens
};