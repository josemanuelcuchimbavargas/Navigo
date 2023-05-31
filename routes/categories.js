"use strict";
// Cargamos el módulo de express para poder crear rutas
var express = require("express");
// Cargamos el controlador
var CategoriesController = require("../controllers/categories");

// Llamamos al router
var api = express.Router();
var md_auth = require("../middlewares/authenticated");
// Creamos una ruta para los métodos que tenemos en nuestros controladores

// USUARIO
api.get("/categories/get", md_auth.ensureAuth, CategoriesController.getCategories);

// Exportamos la configuración
module.exports = api;
