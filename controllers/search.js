"use strict";
// Cargamos los modelos para usarlos posteriormente
var ProductsModel = require("../models/products");
var StoreModel = require("../models/store");
var CategoriesModel = require("../models/categories");
const { removeAccents, convertKM } = require("../functions/utils");

/**
 * Se desarrolla este API con el fin de buscar los productos segun el term de busqueda
 * Se desarrolla este API con el fin de buscar las tiendas segun el term de busqueda
 * Se desarrolla este API con el fin de buscar la categoria segun el term de busqueda
 *
 * @param {*} req
 * @param {*} res
 */
exports.search = async function (req, res) {
  try {
    let ResultData = [];
    const maxDistancia = 50;
    let { lat, lon, page } = req.body;
    let pageSize = 10;
    const term = removeAccents(req.body.term.toLowerCase().trim());
    if (term == "") return res.status(200).send({ ResultData });

    const regex = new RegExp(term, "i");

    // Consultar los productos con paginación
    let productQuery = {
      name: regex,
    };

    // Contar el total de productos que coinciden con la consulta
    let totalProducts = await ProductsModel.countDocuments(productQuery);

    // Aplicar paginación a la consulta de productos
    const skipAmount = (page - 1) * pageSize;
    let Products = await ProductsModel.aggregate([
      {
        $match: productQuery,
      },
      {
        $lookup: {
          from: "stores",
          localField: "id_store",
          foreignField: "_id",
          as: "store",
        },
      },
      {
        $unwind: {
          path: "$store",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $skip: skipAmount,
      },
      {
        $limit: pageSize,
      },
    ]);

    /*let Products = await ProductsModel.find(productQuery)
      .populate("id_store")
      .skip(skipAmount)
      .limit(pageSize);*/

    // Consultar tiendas
    let categoryIds = await CategoriesModel.find({ name: regex }).distinct(
      "_id"
    );

    let query = {
      $or: [
        { name_business: { $regex: regex } },
        { categories: { $in: categoryIds } },
      ],
    };

    // Contar el total de registros que coinciden con la consulta
    let totalStores = await StoreModel.countDocuments(query);

    // Aplicar paginación a la consulta de tiendas
    let Stores = await StoreModel.find(query)
      .populate("categories")
      .skip(skipAmount)
      .limit(pageSize);

    Stores = Stores.filter((store) => store.status === true);

    Stores = Stores.filter(
      (x) => convertKM(lat, lon, x.lan, x.lon) <= maxDistancia
    );

    Products = Products.filter((product) => product.store.status === true);

    Products.forEach((p) => {
      ResultData.push({
        _id: p._id,
        name: p.name,
        description: p.description,
        type: "product",
      });
    });

    Stores.forEach((s) => {
      ResultData.push({
        _id: s._id,
        name: s.name_business,
        description: s.description,
        type: "store",
      });
    });

    res.status(200).send({
      ResultData,
      totalProducts,
      totalStores,
      totalPages: Math.ceil((totalStores + totalProducts) / pageSize),
    });
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
};

exports.view = async function (req, res) {
  try {
    let { _id, type } = req.body;
    let Resultado = null;
    if (type == "product") {
      let Product = await ProductsModel.findOne({ _id: _id });
      let Store = await StoreModel.findOne({ _id: Product.id_store });
      Resultado = {
        name_product: Product.name,
        descripcion_product: Product.description,
        name_store: Store.name_business,
        description_store: Store.description,
        address_store: Store.address,
        phone_store: Store.phone,
        schedule: Store.schedule,
        logo: Store.logo,
        lan: Store.lan,
        lon: Store.lon,
        domicilio: Store.domicilio,
      };
      console.log(Resultado);
    } else {
      let Store = await StoreModel.findOne({ _id: _id });
      Resultado = {
        name_store: Store.name_business,
        description_store: Store.description,
        address_store: Store.address,
        phone_store: Store.phone,
        schedule: Store.schedule,
        lan: Store.lan,
        lon: Store.lon,
        logo: Store.logo,
        domicilio: Store.domicilio,
      };
    }
    res.status(200).send({ Resultado });
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
};
