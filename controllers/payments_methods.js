"use strict";
// Cargamos los modelos para usarlos posteriormente
var PaymentsMethodsModel = require("../models/payments_methods");

// Obtener Datos de un usuario
exports.getPaymentsMethods = async function (req, res) {
  try {
    const PaymentsMethods = await PaymentsMethodsModel.find();

    res.status(200).send({ data: PaymentsMethods });
  } catch (ex) {
    res.status(500).send({ error: ex.message });
  }
};
