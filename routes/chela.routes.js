const express = require("express");
const router = express.Router();

//* OBTENER CONTROLADORES
const {
  obtenerChelas,
  obtenerChela,
  registrarChela,
  editarChela,
  eliminarChela,
} = require("../controllers/chela.controllers");

//* IMPORTAR MIDDLEWARES
const { autenticacion } = require("../middleware/auth");

router.get("/obtener-chelas", obtenerChelas);

router.get("/obtener-chela/:idChela", obtenerChela);

router.post("/registar-chela", autenticacion, registrarChela);

router.put("/editar-chela/:idChela", autenticacion, editarChela);

router.delete("/eliminar-chela/:idChela", autenticacion, eliminarChela);

module.exports = router;
