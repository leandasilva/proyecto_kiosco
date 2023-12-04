'use strit'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProveedorSchema = Schema({
		razonsocial: String,
        domicilio: String,
        telefono: Number,
        email: String,
        monto: String,
        created_at: String,
        user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Proveedor', ProveedorSchema);