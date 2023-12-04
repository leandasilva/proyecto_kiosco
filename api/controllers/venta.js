'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var User = require('../models/user');
var Producto = require('../models/producto');
var Venta = require('../models/venta');
var jwt = require('../services/jwt');
var Follow = require('../models/follow');
const user = require('../models/user');


// Registro
function saveVenta(req, res){
	var params = req.body;
	var venta = new Venta();

	if(params.cantidadprod && params.total){

        
		venta.cantidadprod = params.cantidadprod;
		venta.total = params.total;
		venta.formapago = params.formapago;
        venta.created_at = moment().unix();
        venta.user = req.user.sub;


		// Controlar usuarios duplicados
		Venta.findOne({ $or: [
				{created_at: venta.created_at.toLowerCase()}
		 ]}).exec((err, ventas) => {
		 	if(err) return res.status(500).send({message: 'Error en la petición de usuarios'});

		 	if(ventas && ventas.length >= 1){
		 		return res.status(200).send({message: 'El usuario que intentas registrar ya existe!!'});
		 	}else{

                // Cifra la password y me guarda los datos 
				bcrypt.hash(params.password, null, null, (err, hash) => {
				    user.password = hash;
				    venta.save((err, ventaStored) => {
						if(err) return res.status(500).send({message: 'Error al guardar el usuario'});

						if(ventaStored){
							res.status(200).send({venta: ventaStored});
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
function getVenta(req, res){
	var ventaId = req.params.id;

	Venta.findById(ventaId, (err, venta) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!venta) return res.status(404).send({message: 'El usuario no existe'});

		followThisUser(req.user.sub,ventaId).then((value) => {

			return res.status(200).send({
				venta,
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
function getVentas(req, res){
	var identity_user_id = req.user.sub;

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 5;

	Venta.find().sort('_id').paginate(page, itemsPerPage, (err, ventas, total) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!ventas) return res.status(404).send({message: 'No hay usuarios disponibles'});

		followUserIds(identity_user_id).then((value) => {
			
			return res.status(200).send({
				ventas,
				///users_following: value.following,
				//users_follow_me: value.followed,
				total,
				pages: Math.ceil(total/itemsPerPage)
			});
		
		});

	});	
}




// Edición de datos de usuario
function updateVenta(req, res){
	var productoId = req.params.id;
	var update = req.body;

	// borrar propiedad password
	delete update.password;

	//if(productoId != req.user.sub){
    //	return res.status(500).send({message: 'No tienes permiso para actualizar el producto'});
	//}

	Producto.find({ $or: [
				 {precio: update.precio.toLowerCase()}
		 ]}).exec((err, productos) => {
		 
		 	var producto_isset = false;
		 	productos.forEach((producto) => {
		 		if(producto && producto._id != productoId) producto_isset = true;
		 	});

		 	if(producto_isset) return res.status(404).send({message: 'Los datos ya están en uso'});
		 	
		 	Producto.findByIdAndUpdate(productoId, update, {new:true}, (err, productoUpdated) => {
				if(err) return res.status(500).send({message: 'Error en la petición'});

				if(!productoUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

				return res.status(200).send({producto: productoUpdated});
			});

		 });

}






module.exports = {
	saveVenta,
	getVenta,
	getVentas,
	updateVenta
}