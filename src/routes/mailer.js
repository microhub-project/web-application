const express = require("express");
const router = express.Router();

const mailerController = require("../controllers/mailer.controller")

router.post("/send", function (req, res) {
  mailerController.send(req, res);
})

// [POST] /sendCode

module.exports = router