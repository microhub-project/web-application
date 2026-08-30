const codeController = require("../controllers/code.controller")
const router = require("express").Router()

router.post("/send", (req, res) => {
  codeController.sendCode(req, res)
})

module.exports = router