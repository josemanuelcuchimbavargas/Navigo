"use strict";
// Cargamos los modelos para usarlos posteriormente
var StoreModel = require("../models/store");
const path = require("path");
const fs = require("fs");
const ObjectId = require("mongodb").ObjectId;

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

  const filePath = path.join(__dirname, "..", "files", uniqueFilename); // Ruta completa del archivo

  fs.writeFile(filePath, file.buffer, (err) => {
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
    address,
    phone,
    schedule,
    lan,
    lon,
    logo,
    payments_methods,
    domicilio,
  } = req.body;

  const categoriesArray = JSON.parse(categories);
  const categoryIds = categoriesArray.map((category) => ObjectId(category._id));

  const payments_methodsArray = JSON.parse(payments_methods);
  const payments_methodsIds = payments_methodsArray.map((category) =>
    ObjectId(category._id)
  );

  const newStore = new StoreModel({
    name_business: name_business,
    description: description,
    categories: categoryIds,
    address: address,
    phone: phone,
    schedule: schedule,
    lan: lan,
    lon: lon,
    logo: uniqueFilename,
    payments_methods: payments_methodsIds,
    domicilio: domicilio,
    user_id: req.user.user_id,
  });

  await newStore.save((err) => {
    if (err) {
      fs.promises.unlink(filePath);
      res.status(500).send({ error: err });
    } else {
      res.status(200).send({ msg: "Negocio creado de manera exitosa." });
    }
  });
};

exports.getStoresById = async function (req, res) {
  try {
    const Stores = await StoreModel.find({
      user_id: req.user.user_id,
    });

    res.status(200).send({ data: Stores });
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
};

exports.deleteStoresById = async function (req, res) {
  try {
    const Store = await StoreModel.findOne({
      user_id: req.user.user_id,
      _id: req.body._id,
    });

    let route = path.join(__dirname, "..", "files", Store.logo);
    const resultado = await StoreModel.deleteOne({
      _id: ObjectId(req.body._id),
    });

    if (resultado.deletedCount === 1) {
      fs.unlink(route, (error) => {
        if (error) {
          console.error("Error al eliminar el archivo:", error);
        } else {
          console.log("Archivo eliminado correctamente");
        }
      });
      res.status(200).send({ msg: "Registro eliminado exitosamente" });
    } else {
      res
        .status(500)
        .send({ error: "Ocurrio un error al eliminar el registro" });
    }
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
};
