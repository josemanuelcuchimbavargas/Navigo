"use strict";
// Cargamos los modelos para usarlos posteriormente
var CategoriesModel = require("../models/categories");

// Obtener Datos de un usuario
exports.getCategories = async function (req, res) {
  try {
    const Categories = await CategoriesModel.find();

    res.status(200).send({ data: Categories });
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
};
