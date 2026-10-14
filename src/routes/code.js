import express from "express";
import codeController from "../controllers/code.controller.js";
import verifyJWT from "../authMiddleware.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/getAll", codeController.getAllCodes);

router.post("/send", codeController.sendCode);

router.put("/edit", codeController.editCode);

router.delete("/disable", codeController.disableCode);

export default router;