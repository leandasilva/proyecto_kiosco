'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var User = require('../models/user');
var Proveedor = require('../models/proveedor');
var Compra = require('../models/compra');
var jwt = require('../services/jwt');
var Follow = require('../models/follow');
const proveedor = require('../models/proveedor');
const user = require('../models/user');
const compra = require('../models/compra');


// Registro
function saveCompra(req, res){
	var params = req.body;
	var compra = new Compra();

	if(params.razonsocial && params.factura){

	    compra.razonsocial = params.razonsocial;
		compra.factura = params.factura;
        compra.monto = params.monto;
		compra.created_at = moment().unix();
        compra.user = req.user.sub;

		// Controlar usuarios duplicados
		Compra.find({ $or: [
				 {razonsocial: compra.razonsocial.toLowerCase()}
		 ]}).exec((err, compras) => {
		 	if(err){ 
				return res.status(500).send({message: 'Error en la petición de usuarios'});
		 	}else{

		 		// Cifra la password y me guarda los datos 
				bcrypt.hash(params.password, null, null, (err, hash) => {
				    user.password = hash;

				    compra.save((err, compraStored) => {
						if(err) return res.status(500).send({message: 'Error al guardar el usuario'});

						if(compraStored){
							res.status(200).send({compra: compraStored});
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


function getComprasUser(req, res){
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var user = req.user.sub;
	if(req.params.user){
		user = req.params.user;
	}

	var itemsPerPage = 4;

	Compra.find({user: user}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, compras, total) => {
		if(err) return res.status(500).send({message: 'Error devolver publicaciones'});

		if(!compras) return res.status(404).send({message: 'No hay publicaciones'});

		return res.status(200).send({
			total_items: total,
			pages: Math.ceil(total/itemsPerPage),
			page: page,
			items_per_page: itemsPerPage,
			compras
		});
	});

}

module.exports = {
	saveCompra,
	getComprasUser,
}