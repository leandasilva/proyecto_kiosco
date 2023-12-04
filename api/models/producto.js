'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductosSchema = Schema({
		nombre: String,
		rubro: String,
		cantidad: Number,
		precio: Number,
		codigo: String,
        estado: String,
		image: String,
		user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Productos', ProductosSchema);