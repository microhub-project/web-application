const codeController = require("../controllers/code.controller")
const router = require("express").Router()

router.get("/getAll", (req, res) => {
  codeController.getAllCodes(req, res)
})

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