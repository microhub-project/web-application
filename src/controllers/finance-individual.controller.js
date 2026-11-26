import financeIndividualModel from "../models/finance-individual.model.js";
import financeIndividualService from "../services/finance-individual.service.js";

async function listarInstancias(req, res) {
    const empresaUUID = req.companyUUID;

    if (!empresaUUID) {
        return res.status(401).json({
            message: "Empresa não identificada."
        });
    }

    try {
        const instancias =
            await financeIndividualModel.getInstances(empresaUUID);

        const resultado =
            await financeIndividualService.analisarInstancias(
                empresaUUID,
                instancias
            );

        return res.status(200).json({
            data: resultado
        });

    } catch (erro) {
        console.error("Erro ao listar instâncias:", erro);

        return res.status(500).json({
            message: "Erro ao listar e analisar as instâncias."
        });
    }
}

async function listarItens(req, res) {
    const empresaUUID = req.companyUUID;
    const uuid = req.params.uuid;

    if (!uuid || !empresaUUID) {
        return res.status(400).json({
            message: "Dados inválidos."
        });
    }

    try {
        const resultado =
            await financeIndividualService.analisarInstancia(
                empresaUUID,
                uuid
            );

        if (!resultado.length) {
            return res.status(404).json({
                message: "Instância não encontrada."
            });
        }

        return res.status(200).json({
            data: resultado
        });

    } catch (erro) {
        console.error("Erro ao buscar análise da instância:", erro);

        return res.status(500).json({
            message: "Erro ao carregar a análise da instância."
        });
    }
}

export default {
    listarInstancias,
    listarItens
};