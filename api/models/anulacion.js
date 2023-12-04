'use strit'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnulacionSchema = Schema({
		cantidadprod: Array,
        total: String,
		formapago: String,
	    created_at: String,
        user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Anulacion', AnulacionSchema);