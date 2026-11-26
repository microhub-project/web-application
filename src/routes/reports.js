import express from "express";
import reportsController from "../controllers/reports.controller.js";
import verifyJWT from "../authMiddleware.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/getGeralFunc", reportsController.listarFunc);

router.get("/getGeralInst", reportsController.getGeralInst);

router.get("/getTotalAlertas", reportsController.getTotalAlertas);

router.get("/getRankingAlertas", reportsController.getRankingAlertas);

router.get("/download-url", reportsController.getDownloadUrl);

export default router;