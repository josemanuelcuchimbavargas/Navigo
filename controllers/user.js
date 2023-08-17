"use strict";
// Cargamos los modelos para usarlos posteriormente
var User = require("../models/user");
var jwt = require("jwt-simple");
const encrypt = require("../functions/encrypt.js");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

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
      tipo_usuario: "usuario",
      created_date: new Date(),
      updated_date: null,
      deleted_date: null,
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

// Restablecer contraseña
exports.forgotPassword = async function (req, res) {
  var { email } = req.body;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const USER = await User.findOne({
      email: email,
      deleted_date: { $eq: null },
    }).session(session);
    console.log(email);
    console.log("-----------");
    console.log(USER);
    if (USER != null) {
      let pass = generatePassword(6);

      const updatedUser = await User.updateOne(
        { _id: USER._id },
        {
          updated_date: new Date(),
          password: encrypt.generateHashPassword(pass),
        }
      ).session(session);

      if (updatedUser.ok > 0) {
        // Configurar el transporte SMTP
        const transporter = nodemailer.createTransport({
          service: "Gmail", // Proveedor de correo electrónico
          auth: {
            user: "navigo.soporte@gmail.com", // Tu dirección de correo electrónico
            pass: "thnmklrvnvwexudr", // Tu contraseña de correo electrónico
          },
        });

        // Configurar el contenido del correo electrónico
        const mailOptions = {
          from: "navigo.soporte@gmail.com", // Tu dirección de correo electrónico
          to: email, // Dirección de correo electrónico del destinatario
          subject: "¡Nueva contraseña generada!", // Asunto del correo electrónico
          html: `<!DOCTYPE html>
          <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <meta name="x-apple-disable-message-reformatting">
            <title></title>
            <style>
              table, td, div, h1, p {font-family: Arial, sans-serif;}
            </style>
          </head>
          <body style="margin:0;padding:0;">
            <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
              <tr>
                <td align="center" style="padding:0;">
                  <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
                    <tr>
                      <td align="center" style="padding:10px 0 30px 0;background:#70bbd9;">
                        <img src="https://www.pngmart.com/files/22/Password-PNG-Transparent.png" alt="" width="300" style="height:auto;display:block;" />
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:36px 30px 42px 30px;">
                        <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                          <tr>
                            <td style="padding:0 0 36px 0;color:#153643;">
                              <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">Recuperación de contraseña</h1>
                              <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Estimado usuario tu nueva contraseña es ${pass}</p>                        
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>`, // Contenido HTML del correo electrónico
        };

        await transporter.sendMail(mailOptions);

        await session.commitTransaction();
        session.endSession();

        return res.status(200).send({
          msg: "Se ha enviado un correo electrónico con una contraseña temporal.",
        });
      } else {
        throw new Error("Ocurrió un error al restablecer la contraseña");
      }
    } else {
      throw new Error("Por favor ingrese un email registrado.");
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).send({
      msg: error.message || "Ocurrió un error al restablecer la contraseña",
    });
  }
};

function generatePassword(lon) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";

  for (let i = 0; i < lon; i++) {
    const indice = Math.floor(Math.random() * characters.length);
    password += characters[indice];
  }
  return password;
}

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
