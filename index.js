// Utilizar funcionalidades del Ecmascript 6
"use strict";
// Cargamos el módulo de mongoose para poder conectarnos a MongoDB
var mongoose = require("mongoose");
// *Cargamos el fichero app.js con la configuración de Express
var app = require("./app");
// Creamos la variable PORT para indicar el puerto en el que va a funcionar el servidor
var port = 3800;
// Le indicamos a Mongoose que haremos la conexión con Promesas
mongoose.Promise = global.Promise;
// Usamos el método connect para conectarnos a nuestra base de datos
//mongodb+srv://digitalesn140:vcHBinh4ha9ppuoU@shopfind.zlmezpk.mongodb.net/StartupCluster&authSource=admin
//mongodb://0.0.0.0:27017/ShopFind
//mongodb+srv://digitalesn140:vcHBinh4ha9ppuoU@shopfind.zlmezpk.mongodb.net/ShopFind&authSource=ShopFind
//mongodb+srv://digitalesn140:vcHBinh4ha9ppuoU@shopfind.zlmezpk.mongodb.net/ShopFind .. CLUSTER
//mongodb://127.0.0.1:27017/Navigo?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1

mongoose
  .connect(
    "mongodb://127.0.0.1:27017/Navigo?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    // Cuando se realiza la conexión, lanzamos este mensaje por consola
    console.log(
      "La conexión a la base de datos Navigo se ha realizado correctamente"
    );

    // CREAR EL SERVIDOR WEB CON NODEJS
    app.listen(port, () => {
      console.log("servidor corriendo en http://146.190.38.98:3800");
    });
  })
  // Si no se conecta correctamente escupimos el error
  .catch((err) => console.log(err));
