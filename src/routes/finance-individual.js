import express from "express";
import lixeiraController from "../controllers/finance-individual.controller.js";
import verifyJWT from "../authMiddleware.js";

const router = express.Router();

router.get("/listar-instancias", lixeiraController.listarInstancias);

router.get("/listar-itens-instancia/:uuid", lixeiraController.listarItens);

export default router;
