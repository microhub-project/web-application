import instanceModel from "../models/instance.model.js";

async function cadastrar(req, res) {
  
}

async function listar(req, res) {
    const companyUUID = req.companyUUID;

    if (!companyUUID)
        return res.status(400).send();

    try {
        const resultado = await instanceModel.getAll(companyUUID);
        console.log("RESULTADO:", resultado);

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
        console.log("RESULTADO:", resultado);

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

export default {
  cadastrar,
  listar,
  listarVolumes
};