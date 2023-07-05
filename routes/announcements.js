"use strict";
// Cargamos el módulo de express para poder crear rutas
var express = require("express");
// Cargamos el controlador
var AnnouncementController = require("../controllers/announcements");

// Llamamos al router
var api = express.Router();
var md_auth = require("../middlewares/authenticated");
// Creamos una ruta para los métodos que tenemos en nuestros controladores

// USUARIO
api.post(
  "/announcement/get",
  md_auth.ensureAuth,
  AnnouncementController.getAnnouncement
);
api.post(
  "/announcement/post",
  md_auth.ensureAuth,
  AnnouncementController.insertAnnouncementByStore
);
api.post(
  "/announcement/delete",
  md_auth.ensureAuth,
  AnnouncementController.deleteAnnouncementById
);

// Exportamos la configuración
module.exports = api;
