"use strict";
// Cargamos los modelos para usarlos posteriormente
var ProductsModel = require("../models/products");
const ObjectId = require("mongodb").ObjectId;
// Obtener Datos de un usuario
exports.getProductsByStore = async function (req, res) {
  try {
    const Products = await ProductsModel.find({
      id_store: req.body.id_store,
    });

    res.status(200).send({ data: Products });
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
};

exports.insertProductsByStore = async function (req, res) {
  try {
    const productsStore = new ProductsModel({
      name: req.body.name,
      description: req.body.description,
      id_store: req.body.id_store,
    });

    await productsStore.save((err) => {
      if (err) {
        fs.promises.unlink(filePath);
        res.status(500).send({ error: err });
      } else {
        res.status(200).send({ msg: "Producto creado de manera exitosa." });
      }
    });
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
};

exports.deleteProductsById = async function (req, res) {
  try {
    const resultado = await ProductsModel.deleteOne({
      _id: ObjectId(req.body._id),
    });

    if (resultado.deletedCount === 1) {
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
