"use strict";
// Cargamos el módulo de express para poder crear rutas
var express = require("express");
// Cargamos el controlador
var SearchController = require("../controllers/search");

// Llamamos al router
var api = express.Router();
var md_auth = require("../middlewares/authenticated");
// Creamos una ruta para los métodos que tenemos en nuestros controladores

// USUARIO
api.post("/search/get", md_auth.ensureAuth, SearchController.search);
api.post("/search/view", md_auth.ensureAuth, SearchController.view);

// Exportamos la configuración
module.exports = api;
