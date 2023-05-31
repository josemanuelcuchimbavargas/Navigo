"use strict";
// Cargamos el módulo de express para poder crear rutas
var express = require("express");
// Cargamos el controlador
var UserController = require("../controllers/user");

// Llamamos al router
var api = express.Router();
var md_auth = require("../middlewares/authenticated");
// Creamos una ruta para los métodos que tenemos en nuestros controladores

// USUARIO
api.post("/login", UserController.login);
api.post("/register", UserController.registerUser);
api.get("/get", md_auth.ensureAuth, UserController.getUser);
api.put("/put", md_auth.ensureAuth, UserController.updateUser);
api.put("/put/password", md_auth.ensureAuth, UserController.updatePasswordUser);
api.post("/get/fields", md_auth.ensureAuth, UserController.getEspecificData);


// Exportamos la configuración
module.exports = api;
