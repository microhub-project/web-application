import alertModel from "../models/alert.model.js";

async function listar(req, res) {
  const userUUID = req.params.uuid;

  if (!userUUID)
    return res.status(400).send();

  try {
    const resultado = await microserviceModel.listar(userUUID);
    console.log("RESULTADO:", resultado);
    return res.status(200).json(resultado);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Erro ao listar microsserviços"
    });
  }
}

export default {
  listar
};