const AutModel = require("../models/aut.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const shortId = require("shortid");
const ChelaModel = require("../models/chela.models");

const miUsuario = async (req, res, next) => {
  const { id } = req.params;

  try {
    const usuarioEncontrado = await AutModel.findById(id).select(
      "-__v -password -token"
    );
    if (!usuarioEncontrado) {
      return res.status(404).json({ msg: "Usuario No Encontrado" });
    }

    return res.status(200).json(usuarioEncontrado);
  } catch (error) {
    return res.status(400).json({ msg: `Ocurrió un error: ${error.message}` });
  }
};

const iniciarSesion = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userEncontrado = await AutModel.findOne({ email });

    //* VERIFICAR SI EL USUARIO EXISTE
    if (!userEncontrado) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    //* REVISAR SI EL PASSWORD ES CORRECTO
    if (!(await bcrypt.compare(password, userEncontrado.password))) {
      return res.status(400).json({ msg: "Password Incorrecto" });
    }

    //* GENERAR ID PARA EL TOKEN
    const idToken = shortId.generate();

    //* GENERAR TOKEN CON TODOS LOS DATOS
    const token = jwt.sign(
      {
        id: userEncontrado._id.toString(),
        email: userEncontrado.email,
        idToken,
      },
      process.env.LLAVE_SECRETA,
      { expiresIn: "90d" }
    );

    //* ASIGNAR EL TOKEN AL USUARIO EN LA BD
    userEncontrado.token = token;
    await userEncontrado.save();

    const usuario = {
      id: userEncontrado._id.toString(),
      nombre: userEncontrado.nombre,
      apellido: userEncontrado.apellido,
      token: userEncontrado.token,
    };
    return res
      .status(200)
      .json({ msg: "Autenticaión Correcta", userEncontrado: usuario });
  } catch (error) {
    return res.status(400).json({ msg: `Ocurrió un error: ${error.message}` });
  }
};

const registrarse = async (req, res, next) => {
  const errores = [];

  try {
    //* VALIDACIÓNES CON EXPRESIONES REGULARES
    const ValidacionEmail = new RegExp(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "g"
    );
    const validacionNombre = new RegExp(/^[a-zA-Z]{3,25}$/);
    const validacionApellido = new RegExp(/^[a-zA-Z]{3,25}$/);
    const validacionPassword = new RegExp(/^([a-zA-Z0-9]){7,15}$/);

    //* COMPROBAR LAS VALIDACIONES
    if (!validacionNombre.test(req.body.nombre)) {
      errores.push("El NOMBRE es inválido");
    }
    if (!validacionApellido.test(req.body.apellido)) {
      errores.push("El APELLIDO es inválido");
    }
    if (!ValidacionEmail.test(req.body.email)) {
      errores.push("El EMAIL es inválido");
    }
    if (!validacionPassword.test(req.body.password)) {
      errores.push("El PASSWORD es inválido");
    }

    if (errores.length > 0) {
      return res.status(400).json({ msg: errores });
    }

    //* GUARDAR USUARIO
    await AutModel.create(req.body);

    return res.status(200).json({ msg: "Registro Exitoso" });
  } catch (error) {
    const arrayErrors = [];

    //! PONER ERRORES EN UN ARREGLO DE ERRORES
    if (error.errors) {
      error.errors.nombre?.properties.type === "required" &&
        arrayErrors.push("El NOMBRE es obligatorio");
      error.errors.apellido?.properties.type === "required" &&
        arrayErrors.push("El APELLIDO es obligatorio");
      error.errors.password?.properties.type === "required" &&
        arrayErrors.push("El PASSWORD es obligatorio");
      error.errors.email?.properties.type === "required" &&
        arrayErrors.push("El EMAIL es obligatorio");
    }

    error.code === 11000 && arrayErrors.push("El EMAIL ya está registrado");

    //! MOSTRAR LOS ERRORES ACOMULADOS
    console.log(error);
    return res.status(400).json({ msg: arrayErrors });
  }
};

const editarPerfil = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;
    const usuario = req.usuario;
    const { nombre, apellido, password } = req.body;

    const usuarioEncontrado = await AutModel.findById(idUsuario);
    //* COMPROBAR QUE EL USUARIO EXISTE
    if (!usuarioEncontrado) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    //* COMPROBAR CON EL TOKEN QUE EL USUARIO TENGA PERMISO DE EDITAR
    if (usuario.id !== usuarioEncontrado._id.toString()) {
      return res
        .status(403)
        .json({ msg: "No tienes permiso para editar este perfil" });
    }

    //* ACTUALIZAR DATOS QUE EL USUARIO HAYA DADO
    if (nombre) usuarioEncontrado.nombre = nombre;
    if (apellido) usuarioEncontrado.apellido = apellido;
    if (password) usuarioEncontrado.password = password;

    //* GUARDAR EN LA BASE DE DATOS
    await usuarioEncontrado.save();

    return res
      .status(200)
      .json({ msg: "Tus datos se han actualizado correctamente" });
  } catch (error) {
    console.log(error);

    return res
      .status(400)
      .json({ msg: `Ha Ocurrido un error: ${error.message}` });
  }
};

const eliminarPerfil = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;
    const usuario = req.usuario;

    const usuarioEncontrado = await AutModel.findOne({ _id: idUsuario });

    //* COMPROBAR QUE EL USUARIO EXISTA
    if (!usuarioEncontrado || usuarioEncontrado.length === 0) {
      return res.status(404).json({ msg: "El usuario no existe" });
    }

    //* COMPROBAR QUE EL USUARIO TENGA PERMISO DE HACER CAMBIOS
    if (usuario.id !== usuarioEncontrado._id.toString()) {
      return res
        .status(403)
        .json({ msg: "No tienes permiso para editar este perfil" });
    }

    //* ELIMINAR EL USUARIO DE LA BD
    await ChelaModel.deleteMany({ idUsuario: usuarioEncontrado._id });
    await usuarioEncontrado.deleteOne();

    return res.status(200).json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    console.log(error);

    return res
      .status(400)
      .json({ msg: `Ha Ocurrido un error: ${error.message}` });
  }
};

module.exports = {
  miUsuario,
  iniciarSesion,
  registrarse,
  editarPerfil,
  eliminarPerfil,
};
