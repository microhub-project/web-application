import express from "express";
import usuarioController from "../controllers/usuario.controller.js";
import verifyJWT from "../authMiddleware.js";

const router = express.Router();

router.post("/cadastrar", usuarioController.cadastrar);

router.post("/autenticar", usuarioController.autenticar);

router.get("/listar/:uuid", verifyJWT, usuarioController.listar);

router.get("/pesquisar/:nome", verifyJWT, usuarioController.pesquisar);

router.get("/:uuid", verifyJWT, usuarioController.buscarPorUUID);

router.put("/atualizar/:uuid", verifyJWT, usuarioController.atualizar);

router.delete("/excluir/:uuid", verifyJWT, usuarioController.excluir);

export default router;