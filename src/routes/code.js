const codeController = require("../controllers/code.controller")
const router = require("express").Router()

router.post("/send", (req, res) => {
  codeController.sendCode(req, res)
})

router.put("/edit", (req, res) => {
  codeController.editCode(req, res)
})

router.delete("/disable", (req, res) => {
  codeController.disableCode(req, res)
})

module.exports = router