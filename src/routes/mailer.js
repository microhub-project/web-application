import express from "express";
import mailerController from "../controllers/mailer.controller.js";

const router = express.Router();

router.post("/send", function (req, res) {
  mailerController.send(req, res);
});

// [POST] /sendCode

export default router;