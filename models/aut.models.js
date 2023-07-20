const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const autSchema = new Schema({
  nombre: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
  },
  apellido: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  token: {
    type: String,
    defautl: "",
  },
});

//* MÉTODO PARA HASHEAR EL PASSWORD
autSchema.pre("save", async function (next) {
  //? Si el password esta hasheado...
  if (!this.isModified("password")) {
    return next();
  }

  //? SI NO...
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;

  next();
});

module.exports = mongoose.model("Aut", autSchema);
