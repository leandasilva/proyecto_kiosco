'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var User = require('../models/user');
var Proveedor = require('../models/proveedor');
var jwt = require('../services/jwt');
var Follow = require('../models/follow');
const proveedor = require('../models/proveedor');
const user = require('../models/user');


// Registro
function saveProveedor(req, res){
	var params = req.body;
	var proveedor = new Proveedor();

	if(params.razonsocial && params.domicilio && 
	    params.email){

	    proveedor.razonsocial = params.razonsocial;
		proveedor.domicilio = params.domicilio;
		proveedor.telefono = params.telefono;
		proveedor.email = params.email;
        proveedor.monto = params.monto;
		proveedor.created_at = moment().unix();
        proveedor.user = req.user.sub;

		// Controlar usuarios duplicados
		Proveedor.find({ $or: [
				 {email: proveedor.email.toLowerCase()},
				 {razonsocial: proveedor.razonsocial.toLowerCase()}
		 ]}).exec((err, proveedores) => {
		 	if(err) return res.status(500).send({message: 'Error en la petición de usuarios'});

		 	if(proveedores && proveedores.length >= 1){
		 		return res.status(200).send({message: 'El usuario que intentas registrar ya existe!!'});
		 	}else{

		 		// Cifra la password y me guarda los datos 
				bcrypt.hash(params.password, null, null, (err, hash) => {
				    user.password = hash;

				    proveedor.save((err, proveedorStored) => {
						if(err) return res.status(500).send({message: 'Error al guardar el usuario'});

						if(proveedorStored){
							res.status(200).send({proveedor: proveedorStored});
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
function getProveedor(req, res){
	var proveedorId = req.params.id;

	Proveedor.findById(proveedorId, (err, proveedor) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!proveedor) return res.status(404).send({message: 'El usuario no existe'});

		followThisUser(req.user.sub, proveedorId).then((value) => {
			admin.password = undefined;

			return res.status(200).send({
				proveedor,
				following: value.following, 
				followed: value.followed
			});
		});

	});
}

async function followThisUser(identity_proveedor_id, proveedor_id){
	var following = await Follow.findOne({"proveedor":identity_proveedor_id, "followed":proveedor_id}).exec((err, follow) => {
			if(err) return handleError(err); 
			return follow;
		});

	var followed = await Follow.findOne({"proveedor":proveedor_id, "followed":identity_proveedor_id}).exec((err, follow) => {
			if(err) return handleError(err); 
			return follow;
		});

	return {
		following: following,
		followed: followed
	}
}

async function followUserIds(proveedor_id) {
    try {
        var following = await Follow.find({ 'proveedor': proveedor_id }).select({ '_id': 0, '__v': 0, 'proveedor': 0 }).exec()
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
 
        var followed = await Follow.find({ 'followed': proveedor_id }).select({ '_id': 0, '__v': 0, 'followed': 0 }).exec()
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


function getProveedorUser(req, res){
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var user = req.user.sub;
	if(req.params.user){
		user = req.params.user;
	}

	var itemsPerPage = 4;

	Proveedor.find({user: user}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, proveedores, total) => {
		if(err) return res.status(500).send({message: 'Error devolver publicaciones'});

		if(!proveedores) return res.status(404).send({message: 'No hay publicaciones'});

		return res.status(200).send({
			total_items: total,
			pages: Math.ceil(total/itemsPerPage),
			page: page,
			items_per_page: itemsPerPage,
			proveedores
		});
	});

}



module.exports = {
	saveProveedor,
	getProveedor,
	getProveedorUser
}