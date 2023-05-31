"use strict";
// Cargamos los modelos para usarlos posteriormente
var User = require("../models/user");
var jwt = require("jwt-simple");
const encrypt = require("../functions/encrypt.js");

// Login de usuario
exports.login = async function (req, res) {
  var { email, password } = req.body;
  const USER = await User.findOne({
    email: email,
    deleted_date: { $eq: null },
  });

  if (USER != null) {
    if (encrypt.verifyPassword(password, USER.password)) {
      const payload = { user_id: USER._id, email: USER.email };
      const token = jwt.encode(payload, "?xugw#BaH8=V_YJ");
      // secret key : ? xbox usa golf walmart # BESTBUY apple HULU 8 = VISA _ YELP JACK
      const response = {
        token: token,
        name: USER.name,
        surname: USER.surname,
        id: USER._id,
        tipo_usuario: USER.tipo_usuario,
      };
      return res.status(200).send(response);
    }
  }

  return res.json({ msg: "Credenciales incorrectas" });
};

// Función asíncrona que va a estar esperando por respuestas
exports.registerUser = async function (req, res) {
  // Devuelve el objeto del usuario en caso de que se encuentre una coincidencia
  // entre el email otorgaro por el usuario y un email registrado en la bd
  const findEmail = await User.findOne({ email: req.body.email });

  if (findEmail) {
    res.json({ Message: "El correo ya extiste" });
  } else {
    const USER = new User({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      tel: req.body.tel,
      password: encrypt.generateHashPassword(req.body.password),
      gender: req.body.gender,
      created_date: req.body.created_date,
      updated_date: req.body.updated_date,
      deleted_date: req.body.deleted_date,
    });

    await USER.save((err) => {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        res.status(200).send({ msg: "Usuario guardado en la base de datos" });
      }
    });
  }
};

// Obtener Datos de un usuario
exports.getUser = async function (req, res) {
  try {
    const USER = await User.findOne({
      _id: req.user.user_id,
      deleted_date: { $eq: null },
    });

    let user = {
      id: USER.id,
      name: USER.name,
      surname: USER.surname,
      email: USER.email,
      tel: USER.tel,
      tipoUsuario: USER.tipo_usuario,
    };

    res.status(200).send({ data: user });
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
};

exports.getEspecificData = async function (req, res) {
  try {

    let fields = req.body.fields;
    let fieldNames = fields.split(",");

    const USER = await User.findOne({
      _id: req.user.user_id,
      deleted_date: { $eq: null },
    });

    let user = {};

    fieldNames.forEach((fieldName) => {
      user[fieldName] = USER[fieldName];
    });

    res.status(200).send({ data: user });
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
  
};

// Actualizar datos de un usuario
exports.updateUser = async function (req, res) {
  try {
    const USER = await User.updateOne(
      { _id: req.user.user_id },
      {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        tel: req.body.tel,
        tipo_usuario: req.body.tipo_usuario,
      }
    );

    if (USER.ok > 0) {
      res.status(200).send({ msg: "Datos actualizados exitosamente!" });
    } else {
      res.status(500).send({ msg: "No fue posible actualizar los datos" });
    }
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
};

// Actualizar contraseña de un usuario
exports.updatePasswordUser = async function (req, res) {
  try {
    const USER = await User.updateOne(
      { _id: req.user.user_id },
      {
        password: encrypt.generateHashPassword(req.body.password),
      }
    );

    if (USER.ok > 0) {
      res.status(200).send({ msg: "Datos actualizados exitosamente!" });
    } else {
      res.status(500).send({ msg: "No fue posible actualizar los datos" });
    }
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
};
