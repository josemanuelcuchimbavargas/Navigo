// Utilizar funcionalidades del Ecmascript 6
"use strict";
// Cargamos los módulos de express y body-parser

var express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
// Llamamos a express para poder crear el servidor
var app = express();

var cors = require("cors");

var multer = require("multer");

var upload = multer();

app.use(cors());
const directorioDeImagenes = path.join(__dirname, "files");
app.use("/files", express.static(directorioDeImagenes));
app.use(
  cors({
    origin: "*",
  })
);

app.use(upload.single("file"));

// Importamos las rutas
var user_routes = require("./routes/user");
var store_routes = require("./routes/store");
var categories_routes = require("./routes/categories");
var payments_methods_routes = require("./routes/payments_methods");
var products_routes = require("./routes/products");
var search_routes = require("./routes/search");
var announcement_routes = require("./routes/announcements");
var subscription_routes = require("./routes/subscriptions");

//cargar middlewares
//un metodo que se ejecuta antes que llegue a un controlador
//Configuramos bodyParser para que convierta el body de nuestras peticiones a JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cargamos las rutas
app.use("/api", user_routes);
app.use("/api", store_routes);
app.use("/api", categories_routes);
app.use("/api", payments_methods_routes);
app.use("/api", products_routes);
app.use("/api", search_routes);
app.use("/api", announcement_routes);
app.use("/api", subscription_routes);

// exportamos este módulo para poder usar la variable app fuera de este archivo
module.exports = app;
