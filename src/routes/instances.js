import express from "express";
import instanceController from "../controllers/instance.controller.js";
import verifyJWT from "../authMiddleware.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/listar", instanceController.listar);

router.get("/listar-volumes/:instance_uuid", instanceController.listarVolumes);

router.get("/listar-componentes", instanceController.listarComponentes);

router.get("/listar-tipos", instanceController.listarTipos);

router.get("/listar-componentes-monitorados/:instance_uuid", instanceController.listarComponentesMonitorados);

router.post("/cadastrar", instanceController.cadastrar);

router.post("/cadastrar-volume", instanceController.cadastrarVolume);

router.post("/cadastrar-componente-instancia", instanceController.cadastrarComponenteInstancia);

router.post("/apagar", instanceController.apagar);

router.post("/apagar-volume", instanceController.apagarVolume);

router.post("/atualizar", instanceController.atualizar);

router.post("/atualizar-componente-instancia", instanceController.atualizarComponenteInstancia);

export default router;