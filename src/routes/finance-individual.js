import express from "express";
import financeIndividualController from "../controllers/finance-individual.controller.js";
import verifyJWT from "../authMiddleware.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/listar-instancias", financeIndividualController.listarInstancias);

router.get("/listar-itens-instancia/:uuid", financeIndividualController.listarItens);

export default router;
