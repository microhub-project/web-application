import express from "express";
import alertController from "../controllers/alert.controller.js";
import verifyJWT from "../authMiddleware.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/listar", alertController.listar);

export default router;