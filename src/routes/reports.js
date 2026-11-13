import express from "express";
import reportsController from "../controllers/reports.controller.js";
import verifyJWT from "../authMiddleware.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/getGeralFunc", reportsController.listarFunc);

export default router;