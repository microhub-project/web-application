import express from "express";
import microserviceController from "../controllers/microservice.controller.js";
import verifyJWT from "../authMiddleware.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/listar", microserviceController.listar);

router.post("/cadastrar", microserviceController.cadastrar);

router.post("/apagar", microserviceController.apagar);

router.post("/atualizar", microserviceController.atualizar);

export default router;