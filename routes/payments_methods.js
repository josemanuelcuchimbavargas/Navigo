"use strict";
// Cargamos el módulo de express para poder crear rutas
var express = require("express");
// Cargamos el controlador
var PaymentsMethodsController = require("../controllers/payments_methods");

// Llamamos al router
var api = express.Router();
var md_auth = require("../middlewares/authenticated");
// Creamos una ruta para los métodos que tenemos en nuestros controladores

// USUARIO
api.get("/payments/get", md_auth.ensureAuth, PaymentsMethodsController.getPaymentsMethods);

// Exportamos la configuración
module.exports = api;
