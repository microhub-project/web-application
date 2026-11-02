import express from "express";
import lixeiraController from "../controllers/lixeira.controller.js";
import verifyJWT from "../authMiddleware.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/listar-instancias", lixeiraController.listarInstancias);

router.get("/listar-micros", lixeiraController.listarMicros);

router.get("/listar-componentes", lixeiraController.listarComponentes);

router.get("/listar-usuarios", lixeiraController.listarUsuarios);

router.get("/listar-volumes", lixeiraController.listarVolumes);

router.put("/recuperar-instancia/:uuid", lixeiraController.recuperarInstancia);

router.put("/recuperar-micro/:uuid", lixeiraController.recuperarMicro);

router.put("/recuperar-componente/:componente_uuid/:instancia_uuid", lixeiraController.recuperarComponente);

router.put("/recuperar-usuario/:uuid", lixeiraController.recuperarUsuario);

router.put("/recuperar-volume/:uuid", lixeiraController.recuperarVolume);

router.delete("/apagar-instancia/:uuid", lixeiraController.apagarInstancia);

router.delete("/apagar-micro/:uuid", lixeiraController.apagarMicro);

router.delete("/apagar-componente/:componente_uuid/:instancia_uuid", lixeiraController.apagarComponente);

router.delete("/apagar-usuario/:uuid", lixeiraController.apagarUsuario);

router.delete("/apagar-volume/:uuid", lixeiraController.apagarVolume);

export default router;