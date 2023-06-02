"use strict";
// Cargamos el módulo de express para poder crear rutas
var express = require("express");
// Cargamos el controlador
var ProductsController = require("../controllers/products");

// Llamamos al router
var api = express.Router();
var md_auth = require("../middlewares/authenticated");
// Creamos una ruta para los métodos que tenemos en nuestros controladores

// USUARIO
api.post("/products/get", md_auth.ensureAuth, ProductsController.getProductsByStore);
api.post("/products/delete", md_auth.ensureAuth, ProductsController.deleteProductsById);
api.post("/products/register", md_auth.ensureAuth, ProductsController.insertProductsByStore);

// Exportamos la configuración
module.exports = api;
