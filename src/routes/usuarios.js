var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuario.controller");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
  usuarioController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
  usuarioController.autenticar(req, res);
});

router.get("/listar", function (req, res) {
    usuarioController.listar(req, res);
});

router.get("/pesquisar/:nome", function (req, res) {
    usuarioController.pesquisar(req, res);
});

router.get("/:id", function (req, res) {
    usuarioController.buscarPorId(req, res);
});

router.put("/atualizar/:id", function (req, res) {
    usuarioController.atualizar(req, res);
});

router.delete("/excluir/:id", function (req, res) {
    usuarioController.excluir(req, res);
});

module.exports = router;