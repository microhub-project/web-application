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

async function listarComponentes(req, res) {
    const companyUUID = req.companyUUID;

    if (!companyUUID)
        return res.status(400).send();

    try {
        const response = await lixeiraModel.getComponentes(companyUUID);
        
        console.log("RESULTADO:", response);

        return res.status(200).json({
            data: response
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar componentes"
        });
    }
}

async function listarUsuarios(req, res) {
  const empresaUUID = req.companyUUID;

  if (!empresaUUID)
    return res.status(400).send();

  try {
    const response = await lixeiraModel.getUsuarios(empresaUUID);
    console.log("RESULTADO:", response);
    return res.status(200).json(response);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Erro ao listar usuários"
    });
  }
}

async function listarVolumes(req, res) {
     const empresaUUID = req.companyUUID;

     if (!empresaUUID)
       return res.status(400).send();

     try {
       const response = await lixeiraModel.getVolumes(empresaUUID);
       console.log("RESULTADO:", response);
        return res.status(200).json({
            data: response
        });
     } catch (e) {
       console.error(e);
       return res.status(500).json({
         message: "Erro ao listar volumes"
       });
     }
}

async function recuperarInstancia(req, res) {}




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



async function apagarUsuario(req, res) {
  const uuid = req.params.uuid;

  try {
    const resultado = await lixeiraModel.excluir(uuid);
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



async function recuperarComponente(req, res) {
    // Implementar consulta dos volumes excluídos
}

async function recuperarVolume(req, res) {
    // Implementar consulta dos volumes excluídos
}

async function apagarComponente(req, res) {
    // Implementar consulta dos volumes excluídos
}

async function apagarInstancia(req, res) {
    // Implementar consulta dos volumes excluídos
}

async function apagarVolume(req, res) {
    // Implementar consulta dos volumes excluídos
}

export default {
  listarInstancias,
  recuperarInstancia,
  listarMicros,
  apagarMicro,
  recuperarMicro,
  listarUsuarios,
  apagarUsuario,
  recuperarUsuario,
  listarComponentes,
  listarVolumes,
  recuperarComponente,
  recuperarVolume,
  apagarComponente,
  apagarVolume,
  apagarInstancia
};

