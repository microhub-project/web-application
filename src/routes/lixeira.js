import express from "express";
import lixeiraController from "../controllers/lixeira.controller.js";
import verifyJWT from "../authMiddleware.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/listar-instancias/:microservice_uuid", lixeiraController.listarInstancias);

router.get("/listar-micros", lixeiraController.listarMicros);

router.get("/listar-componentes/:microservice_uuid", lixeiraController.listarComponentes);

router.get("/listar-usuarios/:microservice_uuid", lixeiraController.listarUsuarios);

router.get("/listar-volume/:microservice_uuid", lixeiraController.listarVolume);

router.put("/recuperar-instancias/:microservice_uuid", lixeiraController.recuperarInstancias);

router.put("/recuperar-micros", lixeiraController.recuperarMicros);

router.put("/recuperar-componentes/:microservice_uuid", lixeiraController.recuperarComponentes);

router.put("/recuperar-usuarios/:microservice_uuid", lixeiraController.recuperarUsuarios);

router.put("/recuperar-volume/:microservice_uuid", lixeiraController.recuperarVolume);

router.delete("/apagar-instancia", lixeiraController.apagarInstancia);

router.delete("/apagar-micros", lixeiraController.apagarMicros);

router.delete("/apagar-componentes/:microservice_uuid", lixeiraController.apagarComponentes);

router.delete("/apagar-usuarios/:microservice_uuid", lixeiraController.apagarUsuarios);

router.delete("/apagar-volume/:microservice_uuid", lixeiraController.apagarVolume);

export default router;