'use strit'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompraSchema = Schema({
		razonsocial: String,
        factura: String,
        monto: String,
        created_at: String,
        user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Compra', CompraSchema);