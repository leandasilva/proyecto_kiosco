'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	    razonsocial: String,
		name: String,
		surname: String,
		domicilio: String,
		telefono: String,
		email: String,
		password: String,
		role: String,
		image: String,
		parcial: String,
		total: String
});

module.exports = mongoose.model('User', UserSchema);