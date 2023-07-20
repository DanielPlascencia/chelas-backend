const mongoose = require("mongoose");
const { Schema } = mongoose;

const chelaSchema = new Schema({
  nombre: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
  },
  marca: {
    type: String,
    required: true,
    lowercase: true,
  },
  tipo: {
    type: String,
    trim: true,
    required: true,
  },
  gradosAlcohol: {
    type: String,
    trim: true,
    required: true,
  },
  precio: {
    type: String,
    trim: true,
    required: true,
  },
  idUsuario: {
    type: Schema.Types.ObjectId,
    ref: "Aut",
    required: true,
  },
});

module.exports = mongoose.model("Chela", chelaSchema);
