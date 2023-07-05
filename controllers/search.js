"use strict";
// Cargamos los modelos para usarlos posteriormente
var ProductsModel = require("../models/products");
var StoreModel = require("../models/store");
var CategoriesModel = require("../models/categories");
const {
  removeAccents,
  convertKM,
  convertKMtoMeters,
} = require("../functions/utils");

/**
 * Se desarrolla este API con el fin de buscar los productos segun el term de busqueda
 * Se desarrolla este API con el fin de buscar las tiendas segun el term de busqueda
 * Se desarrolla este API con el fin de buscar la categoria segun el term de busqueda
 *
 * @param {*} req
 * @param {*} res
 */
exports.searchOriginal = async function (req, res) {
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
    ]);

    // Calcular la distancia para cada producto
    Products.forEach((product) => {
      const km = convertKM(lat, lon, product.store.lan, product.store.lon);
      product.km = parseFloat(km);
    });

    // Ordenar los productos por distancia
    Products.sort((a, b) => a.km - b.km);

    // Obtener los productos para la página actual
    let pageProducts = Products.slice(skipAmount, skipAmount + pageSize);

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

    // Calcular la distancia para cada tienda
    Stores.forEach((store) => {
      const km = convertKM(lat, lon, store.lan, store.lon);
      store.km = parseFloat(km);
    });

    // Ordenar los productos por distancia
    Stores.sort((a, b) => a.km - b.km);

    Stores = Stores.filter(
      (store) => store.status === true && store.km <= maxDistancia
    );

    let StoreWithDistance = [];
    Stores.forEach((item) => {
      StoreWithDistance.push({
        categories: item.categories,
        payments_methods: item.payments_methods,
        _id: item._id,
        name_business: item.name_business,
        description: item.description,
        address: item.address,
        phone: item.phone,
        schedule: item.schedule,
        lan: item.lan,
        lon: item.lon,
        logo: item.logo,
        domicilio: item.domicilio,
        user_id: item.user_id,
        status: item.status,
        km: convertKMtoMeters(item.km),
      });
    });

    pageProducts = pageProducts.filter(
      (product) => product.store.status === true && product.km <= maxDistancia
    );

    let ProductWithDistance = [];
    pageProducts.forEach((item) => {
      ProductWithDistance.push({
        _id: item._id,
        name: item.name,
        description: item.description,
        available: item.available,
        id_store: item.id_store,
        km: convertKMtoMeters(item.km),
      });
    });

    ProductWithDistance.forEach((p) => {
      ResultData.push({
        _id: p._id,
        name: p.name,
        description: p.description,
        distance: p.km,
        type: "product",
      });
    });

    StoreWithDistance.forEach((s) => {
      ResultData.push({
        _id: s._id,
        name: s.name_business,
        description: s.description,
        distance: s.km,
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
    //----- definicion de variables -----//
    let Result = [];
    const maxDistancia = 50;
    let { lat, lon, page } = req.body;
    let pageSize = 10;
    const term = removeAccents(req.body.term.toLowerCase().trim());
    if (term == "") return res.status(200).send({ Result });

    //----- definicion de consulta -----//
    const regex = new RegExp(term, "i");

    //----- definicion de paginación -----//
    const skipAmount = (page - 1) * pageSize;

    //----- Logica consulta de productos -----//
    let productQuery = {
      name: regex,
    };

    let totalProducts = await ProductsModel.countDocuments(productQuery);

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
    ]);

    //----- Logica consulta de tiendas -----//
    let categoryIds = await CategoriesModel.find({ name: regex }).distinct(
      "_id"
    );

    let query = {
      $or: [
        { name_business: { $regex: regex } },
        { categories: { $in: categoryIds } },
      ],
    };

    let totalStores = await StoreModel.countDocuments(query);

    let Stores = await StoreModel.find(query).populate("categories");

    //----- Logica unificar products y stores. -----//
    Products.forEach((p) => {
      let km = parseFloat(convertKM(lat, lon, p.store.lan, p.store.lon));
      Result.push({
        _id: p._id,
        name: p.name,
        description: p.description,
        km: km,
        distance: convertKMtoMeters(km),
        type: "product",
        status: p.store.status
      });
    });

    Stores.forEach((s) => {
      let km = parseFloat(convertKM(lat, lon, s.lan, s.lon));
      Result.push({
        _id: s._id,
        name: s.name_business,
        description: s.description,
        km: km,
        distance: convertKMtoMeters(km),
        type: "store",
        status: s.status
      });
    });

    //----- Logica filtrar tiendas verificadas y distancias. -----//
    Result = Result.filter(
      (r) => r.status === true && r.km <= maxDistancia
    );

    //----- Logica ordenamiento de menor a mayor por distancia del usuario. -----//
    Result.sort((a, b) => a.km - b.km);

    //----- Logica de paginación. -----//
    let ResultData = [];
    ResultData = Result.slice(skipAmount, skipAmount + pageSize);

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
