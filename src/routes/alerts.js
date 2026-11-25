import express from "express";
import alertController from "../controllers/alert.controller.js";
import verifyJWT from "../authMiddleware.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/listar", alertController.listar);

router.get("/filtrar")

router.post("/resolver", alertController.resolver);

export default router;