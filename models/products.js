"use strict";
// Cargamos el módulo de mongoose
var mongoose = require("mongoose");
// Usaremos los esquemas
var Schema = mongoose.Schema;
// Creamos el objeto del esquema y sus atributos
var ProductsSchema = Schema({
  name: String,
  description: String,
  available: Boolean,
  id_store: Schema.Types.ObjectId
});
// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model("products", ProductsSchema);
