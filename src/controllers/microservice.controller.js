import microserviceModel from "../models/microservice.model.js";

async function cadastrar(req, res) {
    const uuid = crypto.randomUUID();
    const { empresa_uuid, nome, descricao } = req.body;
    const responseBody = {
        message: ""
    };

    if (!empresa_uuid) {
        responseBody.message = "UUID da empresa inválido";
        return res.status(400).json(responseBody);
    } else if (!nome) {
        responseBody.message = "Nome inválido";
        return res.status(400).json(responseBody);
    } else if (!descricao) {
        responseBody.message = "Descrição inválido";
        return res.status(400).json(responseBody);
    }

    try {
        const response = await microserviceModel.create(uuid, empresa_uuid, nome, descricao);

        if (response.affectedRows !== 1) {
            responseBody.message = "Não foi possível cadastrar o microsserviço. Tente novamente mais tarde";
            return res.status(500).json(responseBody);
        }

        responseBody.message = "Microsserviço cadastrado com sucesso!";
        return res.status(201).json(responseBody);

    } catch (e) {
        console.error(e);
        responseBody.message = "Não foi possível cadastrar o microsserviço. Tente novamente mais tarde";
        return res.status(500).json(responseBody);
    }
}

async function listar(req, res) {
    const companyUUID = req.companyUUID;

    if (!companyUUID)
        return res.status(400).send();

    try {
        const response = await microserviceModel.getAll(companyUUID);
        
        console.log("RESULTADO:", response);

        return res.status(200).json({
            data: response
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar microsserviços"
        });
    }
}

async function apagar(req, res) {
    const uuid = req.body.uuid;
    const responseBody = {
        message: ""
    };


    if (!uuid)
        return res.status(400).send();

    try {
        const response = await microserviceModel.deleteMicroservice(uuid);
        
        if (response.affectedRows !== 1) {
            responseBody.message = "Não foi possível apagar o microsserviço. Tente novamente mais tarde";
            return res.status(500).json(responseBody);
        }

        responseBody.message = "Microsserviço apagado com sucesso!";
        return res.status(201).json(responseBody);
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao apagar microsserviço"
        });
    }
}

async function atualizar(req, res) {
    const { uuid, nome, descricao } = req.body;
    const responseBody = {
        message: ""
    };

    if (!uuid) {
        responseBody.message = "UUID do microsserviço inválido";
        return res.status(400).json(responseBody);
    } else if (!nome) {
        responseBody.message = "Nome inválido";
        return res.status(400).json(responseBody);
    } else if (!descricao) {
        responseBody.message = "Descrição inválido";
        return res.status(400).json(responseBody);
    }

    try {
        const response = await microserviceModel.updateMicroservice(nome, descricao, uuid);

        if (response.affectedRows !== 1) {
            responseBody.message = "Não foi possível atualizar o microsserviço. Tente novamente mais tarde";
            return res.status(500).json(responseBody);
        }

        responseBody.message = "Microsserviço atualizado com sucesso!";
        return res.status(201).json(responseBody);

    } catch (e) {
        console.error(e);
        responseBody.message = "Não foi possível atualizar o microsserviço. Tente novamente mais tarde";
        return res.status(500).json(responseBody);
    }
}

export default {
    cadastrar,
    listar,
    apagar,
    atualizar
};