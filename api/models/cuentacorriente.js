'use strit'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CuentacorrienteSchema = Schema({
		nombre: String,
        apellido: String,
        dni: String,
        domicilio: String,
        telefono: String,
        email: String,
        monto: String,
        imagen: String,
        user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Cuentacorriente', CuentacorrienteSchema);