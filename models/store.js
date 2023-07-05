"use strict";
// Cargamos el módulo de mongoose
var mongoose = require("mongoose");
// Usaremos los esquemas
var Schema = mongoose.Schema;
// Creamos el objeto del esquema y sus atributos
var StoreSchema = Schema({
  name_business: String, //Nombre del negocio
  nit: String, //Nit de la empresa ESTO NO ES OBLIGATORIO PERO ES UN PLUS DE SEGURIDAD
  description: String, //Descripción del negocio
  categories: [{ type: Schema.Types.ObjectId, ref: "categories" }], //Categorias se guardan los IDS de las mismas.
  address: String,
  phone: String, //Telefono de contacto publico de ellos
  schedule: String, //Horarios esto debe ser JSON para manejar todos los horarios de lunes a viernes o fines de semana.
  lan: String, //Latitud
  lon: String, //Longitud
  logo: String, //Logo del negocio y si no tiene se coloca uno por defecto
  payments_methods: [{ type: Schema.Types.ObjectId, ref: "payments_methods" }], //Metodos de pago
  domicilio: Boolean, //Para saber si el usuario maneja domicilio o no.
  user_id: Schema.Types.ObjectId,
  status: Boolean,
  distance: Number
});

/*const ScheduleSchema = new Schema({
  day: String,
  openingTime: String,
  closingTime: String,
});*/

// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model("store", StoreSchema);
