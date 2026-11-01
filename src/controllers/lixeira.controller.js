import lixeiraModel from "../models/lixeira.model.js";

async function listarInstancias(req, res) {
    const companyUUID = req.companyUUID;

    if (!companyUUID)
        return res.status(400).send();

    try {
        const resultado = await lixeiraModel.getInstances(companyUUID);

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

async function listarInstanciasVolumes(req, res) {
    const instanceUUID = req.params.instance_uuid;

    if (!instanceUUID)
        return res.status(400).send();

    try {
        const resultado = await lixeiraModel.getInstancesVolumes(instanceUUID);

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

async function listarInstanciasComponentes(req, res) {
    try {
        const resultado = await lixeiraModel.getInstancesComponents();

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

async function listarInstanciasTipos(req, res) {
    try {
        const resultado = await lixeiraModel.getInstancesTypes();

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

async function apagarInstancia(req, res) {
    const uuid = req.body.uuid;
    const responseBody = {
        message: ""
    };


    if (!uuid)
        return res.status(400).send();

    try {
        try {
            const response = await lixeiraModel.deleteInstanceComponent(uuid);

            if (response.affectedRows < 1) {
                responseBody.message = "Não foi possível apagar os componentes da instância. Tente novamente mais tarde";
                return res.status(500).json(responseBody);
            }
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                message: "Erro ao apagar componentes da instância"
            });
        }

        try {
            const response = await lixeiraModel.deleteInstanceVolume(uuid);

            if (response.affectedRows < 1) {
                responseBody.message = "Não foi possível apagar o(s) volume(s) da instância. Tente novamente mais tarde";
                return res.status(500).json(responseBody);
            }
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                message: "Erro ao apagar volume(s) da instância"
            });
        }

        const response = await lixeiraModel.deleteInstance(uuid);

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

async function recuperarInstancia(req, res) {}

async function listarMicros(req, res) {
    const companyUUID = req.companyUUID;

    if (!companyUUID)
        return res.status(400).send();

    try {
        const response = await lixeiraModel.getMicrosservices(companyUUID);
        
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

async function listarMicrosInstancias(req, res) {
    const microservice_uuid = req.params.microservice_uuid;

    if (!microservice_uuid)
        return res.status(400).send();

    try {
        const resultado = await lixeiraModel.getMicroservicesInstances(microservice_uuid);

        return res.status(200).json({
            data: resultado
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar instâncias do microsserviço"
        });
    }
}

async function apagarMicro(req, res) {
    const uuid = req.body.uuid;
    const responseBody = {
        message: ""
    };


    if (!uuid)
        return res.status(400).send();

    try {
        const response = await lixeiraModel.deleteMicroservice(uuid);
        
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

async function recuperarMicro(req, res) {}

async function listarUsuarios(req, res) {
  const userUUID = req.params.uuid;

  if (!userUUID)
    return res.status(400).send();

  try {
    const resultado = await lixeiraModel.getUsuarios(userUUID);
    console.log("RESULTADO:", resultado);
    return res.status(200).json(resultado);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Erro ao listar usuários"
    });
  }
}

async function apagarUsuario(req, res) {
  const uuid = req.params.uuid;

  try {
    const resultado = await usuarioModel.excluir(uuid);
    if (resultado.affectedRows !== 1) {
      return res.status(400).json({
        message: "Usuário não encontrado"
      });
    }
    return res.status(200).json({
      message: "Usuário excluído com sucesso!"
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      message: "Erro ao excluir usuário"
    });
  }
}

async function recuperarUsuario(req, res) {}

export default {
  listarInstancias,
  listarInstanciasVolumes,
  listarInstanciasComponentes,
  listarInstanciasTipos,
  apagarInstancia,
  recuperarInstancia,
  listarMicros,
  listarMicrosInstancias,
  apagarMicro,
  recuperarMicro,
  listarUsuarios,
  apagarUsuario,
  recuperarUsuario
};

