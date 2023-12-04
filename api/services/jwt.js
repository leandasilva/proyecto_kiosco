'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso_desarrollar_red_social_angular';

exports.createToken = function(user){
	var payload = {
		sub: user._id,
		razonsocial: user.razonsocial,
		name: user.name,
		surname: user.surname,
		domicilio:user.domicilio,
		telefono:user.telefono,
		email:user.email,
		password:user.password,
		role: user.role,
		image: user.image,
		parcial: user.parcial,
		total: user.total,
		iat: moment().unix(),
		exp: moment().add(30,'days').unix
	};

	return jwt.encode(payload,secret);


};