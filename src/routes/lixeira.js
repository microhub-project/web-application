import express from "express";
import lixeiraController from "../controllers/lixeira.controller.js";
import verifyJWT from "../authMiddleware.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/listar-instancias/:microservice_uuid", lixeiraController.listarInstancias);

router.get("/listar-instancias-volumes/:microservice_uuid", lixeiraController.listarInstanciasVolumes);

router.get("/listar-instancias-componentes/:microservice_uuid", lixeiraController.listarInstanciasComponentes);

router.get("/listar-instancias-tipos/:microservice_uuid", lixeiraController.listarInstanciasTipos);

router.get("/listar-micros", lixeiraController.listarMicros);

router.get("/listar-micros-instancias", lixeiraController.listarMicrosInstancias);

router.get("/listar-componentes/:microservice_uuid", lixeiraController.listarComponentes);

router.get("/listar-usuarios/:microservice_uuid", lixeiraController.listarUsuarios);

router.get("/listar-volumes/:microservice_uuid", lixeiraController.listarVolumes);

router.put("/recuperar-instancia/:microservice_uuid", lixeiraController.recuperarInstancia);

router.put("/recuperar-micro", lixeiraController.recuperarMicro);

router.put("/recuperar-componente/:microservice_uuid", lixeiraController.recuperarComponente);

router.put("/recuperar-usuario/:microservice_uuid", lixeiraController.recuperarUsuario);

router.put("/recuperar-volume/:microservice_uuid", lixeiraController.recuperarVolume);

router.delete("/apagar-instancia", lixeiraController.apagarInstancia);

router.delete("/apagar-micro", lixeiraController.apagarMicro);

router.delete("/apagar-componente/:microservice_uuid", lixeiraController.apagarComponente);

router.delete("/apagar-usuario/:microservice_uuid", lixeiraController.apagarUsuario);

router.delete("/apagar-volume/:microservice_uuid", lixeiraController.apagarVolume);

export default router;