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

router.put("/recuperar-instancia", lixeiraController.recuperarInstancia);

router.put("/recuperar-micro", lixeiraController.recuperarMicro);

router.put("/recuperar-componente", lixeiraController.recuperarComponente);

router.put("/recuperar-usuario", lixeiraController.recuperarUsuario);

router.put("/recuperar-volume", lixeiraController.recuperarVolume);

router.delete("/apagar-instancia", lixeiraController.apagarInstancia);

router.delete("/apagar-micro", lixeiraController.apagarMicro);

router.delete("/apagar-componente", lixeiraController.apagarComponente);

router.delete("/apagar-usuario", lixeiraController.apagarUsuario);

router.delete("/apagar-volume", lixeiraController.apagarVolume);

export default router;