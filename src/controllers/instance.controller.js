import instanceModel from "../models/instance.model.js";

async function cadastrar(req, res) {
    const uuid = crypto.randomUUID();
    const { nome, endereco_mac, tipo_uuid, microsservico_uuid } = req.body;
    const responseBody = {
        message: "",
        instance_uuid: uuid
    };

    if (!endereco_mac) {
        responseBody.message = "Endereço MAC inválido";
        return res.status(400).json(responseBody);
    } else if (!tipo_uuid) {
        responseBody.message = "Tipo inválido";
        return res.status(400).json(responseBody);
    } else if (!microsservico_uuid) {
        responseBody.message = "Microsserviço inválido";
        return res.status(400).json(responseBody);
    }

    try {
        const response = await instanceModel.create(uuid, nome, endereco_mac, tipo_uuid, microsservico_uuid);

        if (response.affectedRows !== 1) {
            responseBody.message = "Não foi possível cadastrar a instância. Tente novamente mais tarde";
            return res.status(500).json(responseBody);
        }

        responseBody.message = "Instância cadastrada com sucesso!";
        return res.status(201).json(responseBody);

    } catch (e) {
        console.error(e);
        responseBody.message = "Não foi possível cadastrar a instância. Tente novamente mais tarde";
        return res.status(500).json(responseBody);
    }
}

async function cadastrarVolume(req, res) {
    const uuid = crypto.randomUUID();
    const { armazenamento, instancia_uuid } = req.body;
    const responseBody = {
        message: ""
    };

    if (!armazenamento) {
        responseBody.message = "Armazenamento inválido";
        return res.status(400).json(responseBody);
    } else if (!instancia_uuid) {
        responseBody.message = "UUID da instância inválido";
        return res.status(400).json(responseBody);
    }

    try {
        const response = await instanceModel.createVolume(uuid, armazenamento, instancia_uuid);

        if (response.affectedRows !== 1) {
            responseBody.message = "Não foi possível cadastrar o volume. Tente novamente mais tarde";
            return res.status(500).json(responseBody);
        }

        responseBody.message = "Volume cadastrado com sucesso!";
        return res.status(201).json(responseBody);

    } catch (e) {
        console.error(e);
        responseBody.message = "Não foi possível cadastrar o volume. Tente novamente mais tarde";
        return res.status(500).json(responseBody);
    }
}

async function cadastrarComponenteInstancia(req, res) {
    let { componente_uuid, instancia_uuid, limite_maximo, limite_minimo, monitorado } = req.body;
    const responseBody = {
        message: ""
    };

    if (!limite_maximo) {
        limite_maximo = null;
    }

    if (!limite_minimo) {
        limite_minimo = null;
    }

    if (!componente_uuid) {
        responseBody.message = "UUID do componente inválido";
        return res.status(400).json(responseBody);
    } else if (!instancia_uuid) {
        responseBody.message = "UUID da instância inválido";
        return res.status(400).json(responseBody);
    } else if (monitorado === undefined || monitorado === null) {
        responseBody.message = "Indicação de monitoramento inválida";
        return res.status(400).json(responseBody);
    }

    try {
        const response = await instanceModel.createInstanceComponent(componente_uuid, instancia_uuid, limite_maximo, limite_minimo, monitorado);

        if (response.affectedRows !== 1) {
            responseBody.message = "Não foi possível cadastrar o componente da instância. Tente novamente mais tarde";
            return res.status(500).json(responseBody);
        }

        responseBody.message = "Componente da instância cadastrado com sucesso!";
        return res.status(201).json(responseBody);

    } catch (e) {
        console.error(e);
        responseBody.message = "Não foi possível cadastrar o componente da instância. Tente novamente mais tarde";
        return res.status(500).json(responseBody);
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
        try {
            await instanceModel.deleteInstanceComponent(uuid);
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                message: "Erro ao apagar componentes da instância"
            });
        }

        try {
            await instanceModel.deleteInstanceVolume(uuid);
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                message: "Erro ao apagar volume(s) da instância"
            });
        }

        const response = await instanceModel.deleteInstance(uuid);

        if (response.affectedRows !== 1) {
            responseBody.message = "Não foi possível apagar a instância. Tente novamente mais tarde";
            return res.status(500).json(responseBody);
        }

        responseBody.message = "Instância apagada com sucesso!";
        return res.status(201).json(responseBody);

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao apagar instância"
        });
    }
}

async function apagarVolume(req, res) {
    const uuid = req.body.uuid;
    const responseBody = {
        message: ""
    };


    if (!uuid)
        return res.status(400).send();

    try {
        const response = await instanceModel.deleteVolume(uuid);

        if (response.affectedRows !== 1) {
            responseBody.message = "Não foi possível apagar o volume. Tente novamente mais tarde";
            return res.status(500).json(responseBody);
        }

        responseBody.message = "Volume apagado com sucesso!";
        return res.status(201).json(responseBody);
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao apagar volume"
        });
    }
}

async function listar(req, res) {
    const companyUUID = req.companyUUID;

    if (!companyUUID)
        return res.status(400).send();

    try {
        const resultado = await instanceModel.getAll(companyUUID);

        return res.status(200).json({
            data: resultado
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar instâncias"
        });
    }
}

async function listarVolumes(req, res) {
    const instanceUUID = req.params.instance_uuid;

    if (!instanceUUID)
        return res.status(400).send();

    try {
        const resultado = await instanceModel.getVolumes(instanceUUID);

        return res.status(200).json({
            data: resultado
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar volumes"
        });
    }
}

async function listarComponentes(req, res) {
    try {
        const resultado = await instanceModel.getComponents();

        return res.status(200).json({
            data: resultado
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar componentes"
        });
    }
}

async function listarTipos(req, res) {
    try {
        const resultado = await instanceModel.getTypes();

        return res.status(200).json({
            data: resultado
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar tipos"
        });
    }
}

async function listarComponentesMonitorados(req, res) {
    const instanceUUID = req.params.instance_uuid;

    if (!instanceUUID)
        return res.status(400).send();

    try {
        const resultado = await instanceModel.getMonitoredComponents(instanceUUID);

        return res.status(200).json({
            data: resultado
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar componentes monitorados da instância informada"
        });
    }
}

async function atualizar(req, res) {
    const { nome, endereco_mac, tipo_uuid, microsservico_uuid, uuid } = req.body;
    const responseBody = {
        message: ""
    };

    if (!endereco_mac) {
        responseBody.message = "Endereço MAC inválido";
        return res.status(400).json(responseBody);
    } else if (!tipo_uuid) {
        responseBody.message = "UUID do tipo da instância inválido";
        return res.status(400).json(responseBody);
    } else if (!microsservico_uuid) {
        responseBody.message = "UUID do microsserviço inválido";
        return res.status(400).json(responseBody);
    } else if (!uuid) {
        responseBody.message = "UUID da instância inválido";
        return res.status(400).json(responseBody);
    }

    try {
        const response = await instanceModel.update(nome, endereco_mac, tipo_uuid, microsservico_uuid, uuid);

        if (response.affectedRows !== 1) {
            responseBody.message = "Não foi possível atualizar a instância. Tente novamente mais tarde";
            return res.status(500).json(responseBody);
        }

        responseBody.message = "Instância atualizada com sucesso!";
        return res.status(201).json(responseBody);

    } catch (e) {
        console.error(e);
        responseBody.message = "Não foi possível atualizar a instância. Tente novamente mais tarde";
        return res.status(500).json(responseBody);
    }
}

async function atualizarComponenteInstancia(req, res) {
    let { limite_maximo, limite_minimo, monitorado, componente_uuid, instancia_uuid } = req.body;
    const responseBody = {
        message: ""
    };

    if (!limite_maximo) {
        limite_maximo = null;
    }

    if (!limite_minimo) {
        limite_minimo = null;
    }

    if (monitorado === undefined || monitorado === null) {
        responseBody.message = "Indicação de monitoramento inválida";
        return res.status(400).json(responseBody);
    } else if (!componente_uuid) {
        responseBody.message = "UUID do componente inválido";
        return res.status(400).json(responseBody);
    } else if (!instancia_uuid) {
        responseBody.message = "UUID da instância inválido";
        return res.status(400).json(responseBody);
    }

    try {
        const response = await instanceModel.updateInstanceComponent(limite_maximo, limite_minimo, monitorado, componente_uuid, instancia_uuid);

        if (response.affectedRows !== 1) {
            responseBody.message = "Não foi possível atualizar o componente da instância. Tente novamente mais tarde";
            return res.status(500).json(responseBody);
        }

        responseBody.message = "Componente da instância atualizado com sucesso!";
        return res.status(201).json(responseBody);

    } catch (e) {
        console.error(e);
        responseBody.message = "Não foi possível atualizar o componente da instância. Tente novamente mais tarde";
        return res.status(500).json(responseBody);
    }
}

export default {
    cadastrar,
    cadastrarVolume,
    cadastrarComponenteInstancia,
    apagar,
    apagarVolume,
    listar,
    listarVolumes,
    listarComponentes,
    listarTipos,
    listarComponentesMonitorados,
    atualizar,
    atualizarComponenteInstancia
};