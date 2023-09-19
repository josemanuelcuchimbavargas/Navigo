"use strict";
// Cargamos los modelos para usarlos posteriormente
var SubscriptionModel = require("../models/subscriptions");
var AnnouncementModel = require("../models/announcements");
var StoreModel = require("../models/store");

const ObjectId = require("mongodb").ObjectId;

exports.insertSubscription = async function (req, res) {
  try {
    const subscription = new SubscriptionModel({
      id_user: req.user.user_id,
      id_store: req.body.store_id,
    });

    await subscription.save((err) => {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        res.status(200).send({ msg: "Subscripción exitosa" });
      }
    });
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
};

// Obtener Datos de un usuario
exports.getSubscriptions = async function (req, res) {
  try {
    // Obtener los id_store relacionados de SubscriptionModel filtrados por id_user
    const subscriptionResult = await SubscriptionModel.find({
      id_user: req.user.user_id,
    });
    console.log("ID DEL USUARIO DEL TOKEN");
    console.log(req.user.user_id);

    console.log("DATA DE LA SUBSCRIPCION");
    console.log(subscriptionResult);

    // Obtener los anuncios correspondientes a los id_store
    const idStores = subscriptionResult.map((sub) => sub.id_store);
    const announcements = await AnnouncementModel.find({
      id_store: { $in: idStores },
      active: true,
    });

    console.log("ID DE LA TIENDA");
    console.log(idStores);

    console.log("ANUNCIOS DE LAS TIENDAS");
    console.log(announcements);

    let dataAnnouncements = await procesarAnuncios(announcements);

    res.status(200).send({ data: dataAnnouncements });
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
};

async function procesarAnuncios(announcements) {
  try {
    let tempArray = [];
    await Promise.all(
      announcements.map(async (a) => {
        const store = await StoreModel.findOne({ _id: a.id_store }).select(
          "name_business logo"
        );
        console.log("TIENDA SEGUN ESTE ANUNCIO" , a);
        console.log(store);
        tempArray.push({
          title: a.title,
          description: a.description,
          name: store.name_business,
          logo: store.logo,
        });
      })
    );

    return tempArray;
  } catch (error) {
    console.log("GENERO ERROR" , error);
    return [];
  }
}

exports.getSubscriptionsById = async function (req, res) {
  try {
    const subscriptionResult = await SubscriptionModel.findOne({
      id_user: ObjectId(req.user.user_id),
      id_store: ObjectId(req.body.store_id),
    });

    if (
      subscriptionResult != null &&
      subscriptionResult != undefined &&
      subscriptionResult != ""
    ) {
      res.status(200).send({ data: true });
    } else {
      res.status(200).send({ data: false });
    }
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
};

exports.deleteSubscriptionById = async function (req, res) {
  try {
    const resultado = await SubscriptionModel.deleteOne({
      id_user: ObjectId(req.user.user_id),
      id_store: ObjectId(req.body.store_id),
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

// Obtener Datos de un usuario
exports.getSubscriptionsSettings = async function (req, res) {
  try {
    // Obtener los id_store relacionados de SubscriptionModel filtrados por id_user
    const subscriptionResult = await SubscriptionModel.find({
      id_user: req.user.user_id,
    });

    // Obtener los anuncios correspondientes a los id_store
    const idStores = subscriptionResult.map((sub) => sub.id_store);
    const announcements = await AnnouncementModel.find({
      id_store: { $in: idStores },
      active: true,
    });

    let dataAnnouncements = await procesarAnunciosSettings(announcements);

    res.status(200).send({ data: dataAnnouncements });
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
};

async function procesarAnunciosSettings(announcements) {
  try {
    let tempArray = [];

    await Promise.all(
      announcements.map(async (a) => {
        const store = await StoreModel.findOne({ _id: a.id_store }).select(
          "name_business"
        );
        tempArray.push({
          name: store.name_business,
          id_store: a.id_store,
        });
      })
    );

    return tempArray;
  } catch (error) {
    return [];
  }
}
