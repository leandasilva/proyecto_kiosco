'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var Producto = require('../models/producto');
var Anulacion = require('../models/anulacion');
var jwt = require('../services/jwt');
var Follow = require('../models/follow');
const User = require('../models/user');
const anulacion = require('../models/anulacion');
const user = require('../models/user');


// Registro
function saveAnulacion(req, res){
	var params = req.body;
	var anulacion = new Anulacion();

	if(params.cantidadprod && params.total){

        
		anulacion.cantidadprod = params.cantidadprod;
		anulacion.total = params.total;
		anulacion.formapago = params.formapago;
        anulacion.created_at = moment().unix();
        anulacion.cajero = req.user.sub;

		// Controlar usuarios duplicados
		Anulacion.findOne({ $or: [
				{created_at: anulacion.created_at.toLowerCase()}
		 ]}).exec((err, anulaciones) => {
		 	if(err) return res.status(500).send({message: 'Error en la petición de usuarios'});

		 	if(anulaciones && anulaciones.length >= 1){
		 		return res.status(200).send({message: 'El usuario que intentas registrar ya existe!!'});
		 	}else{

                // Cifra la password y me guarda los datos 
				bcrypt.hash(params.password, null, null, (err, hash) => {
				    user.password = hash;
				    anulacion.save((err, anulacionStored) => {
						if(err) return res.status(500).send({message: 'Error al guardar el usuario'});

						if(anulacionStored){
							res.status(200).send({anulacion: anulacionStored});
						}else{
							res.status(404).send({message: 'No se ha registrado el usuario'});
						}

					});
			
            
		 	});
        }
		 });
		
	}else{
		res.status(200).send({
			message: 'Envia todos los campos necesarios!!'
		});
	}
}


// Conseguir datos de un usuario
function getAnulacion(req, res){
	var anulacionId = req.params.id;

	Anulacion.findById(anulacionId, (err, anulacion) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!anulacion) return res.status(404).send({message: 'El usuario no existe'});

		followThisUser(req.user.sub,anulacionId).then((value) => {

			return res.status(200).send({
				anulacion,
				following: value.following, 
				followed: value.followed
			});
		});

	});
}

async function followThisUser(identity_user_id, user_id){
	var following = await Follow.findOne({"user":identity_user_id, "followed":user_id}).exec((err, follow) => {
			if(err) return handleError(err); 
			return follow;
		});

	var followed = await Follow.findOne({"user":user_id, "followed":identity_user_id}).exec((err, follow) => {
			if(err) return handleError(err); 
			return follow;
		});

	return {
		following: following,
		followed: followed
	}
}

async function followUserIds(user_id) {
    try {
        var following = await Follow.find({ 'user': user_id }).select({ '_id': 0, '__v': 0, 'user': 0 }).exec()
            .then((follows) => {
 
                let follows_clean = []
 
                follows.forEach((follow) => {
                    follows_clean.push(follow.followed)
                });
 
                return follows_clean;
 
            })
            .catch((err) => {
                return handleerror(err);
            });
 
        var followed = await Follow.find({ 'followed': user_id }).select({ '_id': 0, '__v': 0, 'followed': 0 }).exec()
            .then((follows) => {
 
                let follows_clean = []
 
                follows.forEach((follow) => {
                    follows_clean.push(follow.user)
                });
                return follows_clean;
            })
            .catch((err) => {
                return handleerror(err);
            });
 
        return {
            following: following,
            followed: followed
        }
 
    } catch (error) {
        console.log(error);
    }
}


// Devolver un listado de usuarios paginado
function getAnulaciones(req, res){
	var identity_user_id = req.user.sub;

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 5;

	Anulacion.find().sort('_id').paginate(page, itemsPerPage, (err, anulaciones, total) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!anulaciones) return res.status(404).send({message: 'No hay usuarios disponibles'});

		followUserIds(identity_user_id).then((value) => {
			
			return res.status(200).send({
				anulaciones,
				///users_following: value.following,
				//users_follow_me: value.followed,
				total,
				pages: Math.ceil(total/itemsPerPage)
			});
		
		});

	});	
}



module.exports = {
	saveAnulacion,
	getAnulacion,
	getAnulaciones,
}