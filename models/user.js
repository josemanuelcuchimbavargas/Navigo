'use strict'
// Cargamos el módulo de mongoose
var mongoose =  require('mongoose');
// Usaremos los esquemas
var Schema = mongoose.Schema;
// Creamos el objeto del esquema y sus atributos
var UserSchema = Schema({
    name: String,
    surname: String,    
    email: String,
    tel: String,
    password: String,
    tipo_usuario: String,
    created_date: Date,
    updated_date: Date,
    deleted_date: Date
});
// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model('user', UserSchema);