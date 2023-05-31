const bcrypt = require("bcrypt-nodejs");

// Función para encriptar la password del usuario
function generateHashPassword (password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};
  
function verifyPassword (password, hash) {
    return bcrypt.compareSync(password, hash);
};

module.exports = {
    generateHashPassword : generateHashPassword,
    verifyPassword: verifyPassword
};
