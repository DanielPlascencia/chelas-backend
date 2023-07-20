//* CONFIGURAR ARCHIVO .env
require("dotenv").config();

//* IMPORTAR DEPENDENCIAS
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//* IMPORTAR BD DE MONGODB
const db = require("./db/conexion");

//* IMPORTAR RUTAS
const autRoute = require("./routes/aut.routes");
const chelaRoute = require("./routes/chela.routes");

const app = express();
app.use(cors());

//* HABILITAR BODY-PARSER
app.use(bodyParser.json());

//* HABILITAR RUTAS
app.use("/aut", autRoute);
app.use("/chela", chelaRoute);

const port = process.env.PORT || process.env.LOCALPORT;
app.listen(port, () => {
  console.log(`Escuchando en el puerto: ${port}`);
});
