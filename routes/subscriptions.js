"use strict";
// Cargamos el módulo de express para poder crear rutas
var express = require("express");
// Cargamos el controlador
var SubscriptionController = require("../controllers/subscriptions");

// Llamamos al router
var api = express.Router();
var md_auth = require("../middlewares/authenticated");
// Creamos una ruta para los métodos que tenemos en nuestros controladores

// USUARIO
api.post(
  "/subscription/post",
  md_auth.ensureAuth,
  SubscriptionController.insertSubscription
);
api.post(
  "/subscription/get",
  md_auth.ensureAuth,
  SubscriptionController.getSubscriptions
);
api.post(
  "/subscription/delete",
  md_auth.ensureAuth,
  SubscriptionController.deleteSubscriptionById
);
api.post(
  "/subscription/getById",
  md_auth.ensureAuth,
  SubscriptionController.getSubscriptionsById
);
api.post(
  "/subscription/getsettings",
  md_auth.ensureAuth,
  SubscriptionController.getSubscriptionsSettings
);

// Exportamos la configuración
module.exports = api;
