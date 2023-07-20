const ChelaModel = require("../models/chela.models");

const obtenerChelas = async (req, res, next) => {
  try {
    const obtenerChelas = await ChelaModel.find();

    if (!obtenerChela) {
      return res.status(404).json({ msg: "No hay chelas" });
    }

    return res.status(200).json(obtenerChelas);
  } catch (error) {
    return res.status(400).json({ msg: `Ocurrió un error: ${error.message}` });
  }
};

const obtenerChela = async (req, res, next) => {
  try {
    const { idChela } = req.params;

    const obtenerChela = await ChelaModel.findById(idChela);

    if (!obtenerChela) {
      return res.status(404).json({ msg: "No se encontró esa chela" });
    }

    return res.status(200).json(obtenerChela);
  } catch (error) {
    return res.status(400).json({ msg: `Ocurrió un error: ${error.message}` });
  }
};

const registrarChela = async (req, res, next) => {
  const usuarioLogeado = req.usuario;
  const { nombre, marca, tipo, gradosAlcohol, precio } = req.body;

  try {
    if (!nombre || !marca || !tipo || !gradosAlcohol || !precio) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }
    req.body.idUsuario = usuarioLogeado.id;

    const chelaCreada = await ChelaModel.create(req.body);

    return res
      .status(200)
      .json({ msg: "Chela Agregada Correctamente", chelaCreada });
  } catch (error) {
    return res
      .status(400)
      .json({ msg: `Ocurrió un error en la consulta: ${error.message}` });
  }
};

const editarChela = async (req, res, next) => {
  try {
    const usuario = req.usuario;
    const { idChela } = req.params;
    const { nombre, marca, tipo, gradosAlcohol, precio } = req.body;

    const obtenerChela = await ChelaModel.findById(idChela);
    if (!obtenerChela) {
      return res.status(404).json({ msg: "No se encontró la chela" });
    }

    if (usuario.id !== obtenerChela.idUsuario.toString()) {
      return res
        .status(403)
        .json({ msg: "No tienes premiso para editar éste producto" });
    }

    if (nombre) obtenerChela.nombre = nombre;
    if (marca) obtenerChela.marca = marca;
    if (tipo) obtenerChela.tipo = tipo;
    if (gradosAlcohol) obtenerChela.gradosAlcohol = gradosAlcohol;
    if (precio) obtenerChela.precio = precio;

    await obtenerChela.save();

    return res.status(200).json({ msg: "Producto Editado Correctamente" });
  } catch (error) {
    return res
      .status(400)
      .json({ msg: `Ocurrió un error en la consulta: ${error.message}` });
  }
};

const eliminarChela = async (req, res, next) => {
  const usuario = req.usuario;
  const { idChela } = req.params;

  try {
    const obtenerChela = await ChelaModel.findById(idChela);

    if (!obtenerChela) {
      return res.status(404).json({ msg: "No se encontró la chela" });
    }

    if (obtenerChela.idUsuario.toString() !== usuario.id) {
      return res
        .status(403)
        .json({ msg: "No tienes permisos para eliminar este producto" });
    }

    await obtenerChela.deleteOne();

    return res.status(200).json({ msg: "Chela Eliminada Correctamente" });
  } catch (error) {
    return res
      .status(400)
      .json({ msg: `Ocurrió un error en la consulta: ${error.message}` });
  }
};

module.exports = {
  obtenerChelas,
  obtenerChela,
  registrarChela,
  editarChela,
  eliminarChela,
};
