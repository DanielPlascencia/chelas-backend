const jwt = require("jsonwebtoken");
const moment = require("moment");
const AutModel = require("../models/aut.models");

const autenticacion = async (req, res, next) => {
  try {
    //* VERIFICAR QUE HAYA UN HEADER DE AUTORIZACIÓN
    if (!req.headers.authorization) {
      return res.status(404).json({
        msg: "No se envió ningún token de autorización",
      });
    }

    //* OBTENER EL JWT
    const tokenId = req.headers.authorization.split(" ")[1];

    const tokenDecodificado = jwt.decode(tokenId, process.env.LLAVE_SECRETA);

    //* COMPROBAR QUE NO HAYA EXPIRADO
    if (tokenDecodificado.exp <= moment().unix()) {
      return res.status(403).json({
        msg: "El token ha expirado, inicia sesión otra vez",
        tokenExpirado: true,
      });
    }

    //* COMPROBAR QUE EL TOKEN SIGA REGISTRADO EN LA BD.
    const tokenValido = await AutModel.findById(tokenDecodificado.id);
    if (!tokenValido || tokenValido.length === 0) {
      return res.status(404).json({ msg: "El token ya no existe" });
    }

    //* ENVIAR EL TOKEN DECODIFICADO.
    req.usuario = tokenDecodificado;

    next();
  } catch (error) {
    return res.status(200).json({ msg: `Ocurrió un error: ${error.message}` });
  }
};

module.exports = { autenticacion };
