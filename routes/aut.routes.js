const express = require("express");
const router = express.Router();

//* OBTENER CONTROLADORES
const {
  miUsuario,
  iniciarSesion,
  registrarse,
  editarPerfil,
  eliminarPerfil,
} = require("../controllers/aut.controllers");

//* IMPORTAR MIDDLEWARES
const { autenticacion } = require("../middleware/auth");

router.get("/mi-usuario/:id", miUsuario);

router.post("/iniciar-sesion", iniciarSesion);

router.post("/registrarse", registrarse);

router.put("/editar-perfil/:idUsuario", autenticacion, editarPerfil);

router.delete("/eliminar-perfil/:idUsuario", autenticacion, eliminarPerfil);

module.exports = router;
