import alertModel from "../models/alert.model.js";

async function listar(req, res) {
    const companyUUID = req.body?.empresa_uuid;
    const responseBody = {
        message: ""
    };

    if (!companyUUID) {
        responseBody.message = "UUID da empresa inválido";
        return res.status(400).json(responseBody);
    }

    const filters = {
        data: req.body?.data,
        instancia: req.body?.instancia,
        componente: req.body?.componente,
        severidade: req.body?.severidade,
        status: req.body?.status,
        resolvido_por: req.body?.resolvido_por
    };

    try {
        const resultado = await alertModel.getAll(companyUUID, filters);

        return res.status(200).json({
            data: resultado
        });
    } catch (e) {
        console.error(e);
        responseBody.message = "Erro ao listar alertas";
        return res.status(500).json(responseBody);
    }
}

async function resolver(req, res) {
    const { uuid, resolvido_por, empresa_uuid } = req.body;
    const responseBody = {
        message: ""
    };

    if (!uuid) {
        responseBody.message = "UUID do alerta inválido";
        return res.status(400).json(responseBody);
    } else if (!resolvido_por) {
        responseBody.message = "Responsável pela resolução inválido";
        return res.status(400).json(responseBody);
    } else if (!empresa_uuid) {
        responseBody.message = "UUID da empresa inválido";
        return res.status(400).json(responseBody);
    }

    try {
        const response = await alertModel.alterResolvidoPor(resolvido_por, empresa_uuid, uuid);

        if (response.affectedRows !== 1) {
            responseBody.message = "Não foi possível atualizar o alerta. Tente novamente mais tarde";
            return res.status(500).json(responseBody);
        }

        responseBody.message = "Alerta resolvido com sucesso!";
        return res.status(200).json(responseBody);
    } catch (e) {
        console.error(e);
        responseBody.message = "Não foi possível atualizar o alerta. Tente novamente mais tarde";
        return res.status(500).json(responseBody);
    }
}

export default {
    listar,
    resolver
};
