import express from "express";
import dashboardController from "../controllers/dashboard.controller.js";
import verifyJWT from "../authMiddleware.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", dashboardController.carregar);

export default router;
