import express from "express";
import instanceController from "../controllers/instance.controller.js";
import verifyJWT from "../authMiddleware.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/listar", instanceController.listar);

router.post("/cadastrar", instanceController.cadastrar);

export default router;