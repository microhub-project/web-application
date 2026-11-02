
import lixeiraModel from "../models/lixeira.model.js";


// LISTAGENS

async function listarInstancias(req, res) {
    const empresaUUID = req.companyUUID;

    if (!empresaUUID) {
        return res.status(401).json({
            message: "Empresa não identificada."
        });
    }

    try {
        const resultado = await lixeiraModel.getInstances(empresaUUID);

        return res.status(200).json({ data: resultado });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar instâncias."
        });
    }
}


async function listarMicros(req, res) {
    const empresaUUID = req.companyUUID;

    if (!empresaUUID) {
        return res.status(401).json({
            message: "Empresa não identificada."
        });
    }

    try {
        const resultado = await lixeiraModel.getMicrosservices(empresaUUID);

        return res.status(200).json({ data: resultado });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar microsserviços."
        });
    }
}


async function listarComponentes(req, res) {
    const empresaUUID = req.companyUUID;

    if (!empresaUUID) {
        return res.status(401).json({
            message: "Empresa não identificada."
        });
    }

    try {
        const resultado = await lixeiraModel.getComponentes(empresaUUID);

        return res.status(200).json({ data: resultado });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar componentes."
        });
    }
}


async function listarUsuarios(req, res) {
    const empresaUUID = req.companyUUID;

    if (!empresaUUID) {
        return res.status(401).json({
            message: "Empresa não identificada."
        });
    }

    try {
        const resultado = await lixeiraModel.getUsuarios(empresaUUID);

        return res.status(200).json({ data: resultado });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar usuários."
        });
    }
}


async function listarVolumes(req, res) {
    const empresaUUID = req.companyUUID;

    if (!empresaUUID) {
        return res.status(401).json({
            message: "Empresa não identificada."
        });
    }

    try {
        const resultado = await lixeiraModel.getVolumes(empresaUUID);

        return res.status(200).json({ data: resultado });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar volumes."
        });
    }
}


// RECUPERAÇÕES

async function recuperarInstancia(req, res) {
    const uuid = req.params.uuid;
    const empresaUUID = req.companyUUID;

    if (!uuid || !empresaUUID) {
        return res.status(400).json({
            message: "Dados inválidos para recuperar a instância."
        });
    }

    try {
        const resultado = await lixeiraModel.restoreInstance(
            uuid,
            empresaUUID
        );

        if (resultado.affectedRows !== 1) {
            return res.status(404).json({
                message: "Instância não encontrada na lixeira desta empresa."
            });
        }

        return res.status(200).json({
            message: "Instância recuperada com sucesso!"
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao recuperar instância."
        });
    }
}


async function recuperarMicro(req, res) {
    const uuid = req.params.uuid;
    const empresaUUID = req.companyUUID;

    if (!uuid || !empresaUUID) {
        return res.status(400).json({
            message: "Dados inválidos para recuperar o microsserviço."
        });
    }

    try {
        const resultado = await lixeiraModel.restoreMicroservice(
            uuid,
            empresaUUID
        );

        if (resultado.affectedRows !== 1) {
            return res.status(404).json({
                message: "Microsserviço não encontrado na lixeira desta empresa."
            });
        }

        return res.status(200).json({
            message: "Microsserviço recuperado com sucesso!"
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao recuperar microsserviço."
        });
    }
}


async function recuperarComponente(req, res) {
    const { componente_uuid, instancia_uuid } = req.params;
    const empresaUUID = req.companyUUID;

    if (!componente_uuid || !instancia_uuid || !empresaUUID) {
        return res.status(400).json({
            message: "Informe o componente e a instância."
        });
    }

    try {
        const resultado = await lixeiraModel.restoreComponent(
            componente_uuid,
            instancia_uuid,
            empresaUUID
        );

        if (resultado.affectedRows !== 1) {
            return res.status(404).json({
                message: "Componente não encontrado na lixeira desta empresa."
            });
        }

        return res.status(200).json({
            message: "Componente recuperado com sucesso!"
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao recuperar componente."
        });
    }
}


async function recuperarUsuario(req, res) {
    const uuid = req.params.uuid;
    const empresaUUID = req.companyUUID;

    if (!uuid || !empresaUUID) {
        return res.status(400).json({
            message: "Dados inválidos para recuperar o usuário."
        });
    }

    try {
        const resultado = await lixeiraModel.restoreUser(
            uuid,
            empresaUUID
        );

        if (resultado.affectedRows !== 1) {
            return res.status(404).json({
                message: "Usuário não encontrado na lixeira desta empresa."
            });
        }

        return res.status(200).json({
            message: "Usuário recuperado com sucesso!"
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao recuperar usuário."
        });
    }
}


async function recuperarVolume(req, res) {
    const uuid = req.params.uuid;
    const empresaUUID = req.companyUUID;

    if (!uuid || !empresaUUID) {
        return res.status(400).json({
            message: "Dados inválidos para recuperar o volume."
        });
    }

    try {
        const resultado = await lixeiraModel.restoreVol(
            uuid,
            empresaUUID
        );

        if (resultado.affectedRows !== 1) {
            return res.status(404).json({
                message: "Volume não encontrado na lixeira desta empresa."
            });
        }

        return res.status(200).json({
            message: "Volume recuperado com sucesso!"
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao recuperar volume."
        });
    }
}


// EXCLUSÕES PERMANENTES

async function apagarInstancia(req, res) {
    const uuid = req.params.uuid;
    const empresaUUID = req.companyUUID;

    if (!uuid || !empresaUUID) {
        return res.status(400).json({
            message: "Dados inválidos para apagar a instância."
        });
    }

    try {
        const resultado = await lixeiraModel.deleteInstance(
            uuid,
            empresaUUID
        );

        if (resultado.affectedRows !== 1) {
            return res.status(404).json({
                message: "Instância não encontrada na lixeira desta empresa."
            });
        }

        return res.status(200).json({
            message: "Instância apagada permanentemente!"
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao apagar instância."
        });
    }
}


async function apagarMicro(req, res) {
    const uuid = req.params.uuid;
    const empresaUUID = req.companyUUID;

    if (!uuid || !empresaUUID) {
        return res.status(400).json({
            message: "Dados inválidos para apagar o microsserviço."
        });
    }

    try {
        const resultado = await lixeiraModel.deleteMicroservice(
            uuid,
            empresaUUID
        );

        if (resultado.affectedRows !== 1) {
            return res.status(404).json({
                message: "Microsserviço não encontrado na lixeira desta empresa."
            });
        }

        return res.status(200).json({
            message: "Microsserviço apagado permanentemente!"
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao apagar microsserviço."
        });
    }
}


async function apagarComponente(req, res) {
    const { componente_uuid, instancia_uuid } = req.params;
    const empresaUUID = req.companyUUID;

    if (!componente_uuid || !instancia_uuid || !empresaUUID) {
        return res.status(400).json({
            message: "Informe o componente e a instância."
        });
    }

    try {
        const resultado = await lixeiraModel.deleteComponent(
            componente_uuid,
            instancia_uuid,
            empresaUUID
        );

        if (resultado.affectedRows !== 1) {
            return res.status(404).json({
                message: "Componente não encontrado na lixeira desta empresa."
            });
        }

        return res.status(200).json({
            message: "Componente apagado permanentemente!"
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao apagar componente."
        });
    }
}


async function apagarUsuario(req, res) {
    const uuid = req.params.uuid;
    const empresaUUID = req.companyUUID;

    if (!uuid || !empresaUUID) {
        return res.status(400).json({
            message: "Dados inválidos para apagar o usuário."
        });
    }

    try {
        const resultado = await lixeiraModel.deleteUser(
            uuid,
            empresaUUID
        );

        if (resultado.affectedRows !== 1) {
            return res.status(404).json({
                message: "Usuário não encontrado na lixeira desta empresa."
            });
        }

        return res.status(200).json({
            message: "Usuário apagado permanentemente!"
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao apagar usuário."
        });
    }
}


async function apagarVolume(req, res) {
    const uuid = req.params.uuid;
    const empresaUUID = req.companyUUID;

    if (!uuid || !empresaUUID) {
        return res.status(400).json({
            message: "Dados inválidos para apagar o volume."
        });
    }

    try {
        const resultado = await lixeiraModel.deleteVolume(
            uuid,
            empresaUUID
        );

        if (resultado.affectedRows !== 1) {
            return res.status(404).json({
                message: "Volume não encontrado na lixeira desta empresa."
            });
        }

        return res.status(200).json({
            message: "Volume apagado permanentemente!"
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao apagar volume."
        });
    }
}


export default {
    listarInstancias,
    listarMicros,
    listarComponentes,
    listarUsuarios,
    listarVolumes,
    recuperarInstancia,
    recuperarMicro,
    recuperarComponente,
    recuperarUsuario,
    recuperarVolume,
    apagarInstancia,
    apagarMicro,
    apagarComponente,
    apagarUsuario,
    apagarVolume
};
