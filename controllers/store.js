"use strict";
// Cargamos los modelos para usarlos posteriormente
var StoreModel = require("../models/store");
const path = require("path");

// Función asíncrona que va a estar esperando por respuestas
exports.registerStore = async function (req, res) {
  // Obtener el archivo enviado
  //const logoFile = req.files.logo;

  //Validar si el usuario ingreso NIT.
  if (nit != null && nit != "") {
    const findNit = await StoreModel.findOne({ nit: nit });
    if (findNit) {
      res.status(500).json({
        message: `El NIT ${nit} ya se encuentra registrado en nuestro sistema. Si esto es un error o algún caso de plagio, por favor, contáctanos a nuestro equipo de soporte.`,
      });
    }
  }

  const file = req.file;
  const originalname = file.originalname;
  const extension = path.extname(originalname);
  const uniqueFilename = Date.now() + extension; // Generar un nombre único basado en la fecha actual y la extensión del archivo

  const filePath = path.join(__dirname, "files", uniqueFilename); // Ruta completa del archivo

  // Mover el archivo al directorio con el nombre único
  fs.rename(file.path, filePath, (err) => {
    if (err) {
      res.status(500).json({ error: "Error al guardar el archivo" });
    }
  });

  //Obtención de datos
  var {
    name_business,
    nit,
    description,
    categories,
    phone,
    schedule,
    lan,
    lon,
    logo,
    payments_methods,
    domicilio,
  } = req.body;

  const newStore = new StoreModel({
    name_business: name_business,
    description: description,
    categories: categories,
    phone: phone,
    schedule: schedule,
    lan: lan,
    lon: lon,
    logo: uniqueFilename,
    payments_methods: payments_methods,
    domicilio: domicilio,
  });

  await newStore.save((err) => {
    if (err) {
      res.status(500).send({ error: err });
    } else {
      res.status(200).send({ msg: "Negocio creado de manera exitosa." });
    }
  });
};
