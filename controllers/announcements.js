"use strict";
// Cargamos los modelos para usarlos posteriormente
var AnnouncementModel = require("../models/announcements");

exports.insertAnnouncementByStore = async function (req, res) {
  try {
    const announcementStore = new AnnouncementModel({
      title: req.body.title,
      description: req.body.description,
      active: false,
      id_store: req.body.id_store
    });

    await announcementStore.save((err) => {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        res.status(200).send({ msg: "Anuncio creado de manera exitosa." });
      }
    });
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
};

// Obtener Datos de un usuario
exports.getAnnouncement = async function (req, res) {
  try {
    const Announcements = await AnnouncementModel.find({
      id_store: req.body.id_store,
    });

    res.status(200).send({ data: Announcements });
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
};

exports.deleteAnnouncementById = async function (req, res) {
  try {
    const resultado = await AnnouncementModel.deleteOne({
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
