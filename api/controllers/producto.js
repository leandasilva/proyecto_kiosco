'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

var Producto = require('../models/producto');
var User = require('../models/user');
var jwt = require('../services/jwt');
var Follow = require('../models/follow');
const user = require('../models/user');
const producto = require('../models/producto');



function saveProducto(req, res){
	var params = req.body;

	if(!params.nombre) return res.status(200).send({message: 'Debes enviar un texto!!'});

	var producto = new Producto();
	    producto.nombre = params.nombre;
		producto.rubro = params.rubro;
		producto.cantidad = params.cantidad;
        producto.precio = params.precio;
		producto.codigo = params.codigo;
		producto.estado = params.estado;
		producto.user = req.user.sub;

	producto.save((err, productoStored) => {
		if(err) return res.status(500).send({message: 'Error al guardar la publicación'});

		if(!productoStored) return res.status(404).send({message: 'La publicación NO ha sido guardada'});

		return res.status(200).send({producto: productoStored});
	});

}




// Conseguir datos de un producto
function getProducto(req, res){
	var productoId = req.params.id;

	Producto.findById(productoId, (err, producto) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!producto) return res.status(404).send({message: 'El usuario no existe'});

		followThisUser(req.user.sub, productoId).then((value) => {
			producto.codigo = undefined;

			return res.status(200).send({
				producto,
				following: value.following, 
				followed: value.followed
			});
		});

	});
}


async function followThisUser(identity_user_id, cajero_id){
	var following = await Follow.findOne({"cajero":identity_user_id, "followed":cajero_id}).exec((err, follow) => {
			if(err) return handleError(err); 
			return follow;
		});

	var followed = await Follow.findOne({"cajero":cajero_id, "followed":identity_user_id}).exec((err, follow) => {
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
 
        var followed = await Follow.find({ 'user': user_id }).select({ 'user': 0, '__v': 0, 'followed': 0 }).exec()
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
          //  following: following,
            followed: followed
        }
 
    } catch (error) {
        console.log(error);
    }
}


function getProductoUser(req, res){
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var user = req.user.sub;
	if(req.params.user){
		user = req.params.user;
	}

	var itemsPerPage = 60000;

	Producto.find({user: user}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, productos, total) => {
		if(err) return res.status(500).send({message: 'Error devolver publicaciones'});

		if(!productos) return res.status(404).send({message: 'No hay publicaciones'});

		return res.status(200).send({
			total_items: total,
			pages: Math.ceil(total/itemsPerPage),
			page: page,
			items_per_page: itemsPerPage,
			productos
		});
	});

}



// Subir archivos de imagen/avatar de usuario
function uploadImage(req, res){
	var productoId = req.params.id;

	if(req.files){
		var file_path = req.files.image.path;
		console.log(file_path);
		
		var file_split = file_path.split('\\');
		console.log(file_split);

		var file_name = file_split[2];
		console.log(file_name);

		var ext_split = file_name.split('\.');
		console.log(ext_split);

		var file_ext = ext_split[1];
		console.log(file_ext);

		if(productoId != req.user.sub){
			return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos del usuario');
		}

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
			 
			 // Actualizar documento de usuario logueado
			 Producto.findByIdAndUpdate(productoId, {image: file_name}, {new:true}, (err, productoUpdated) =>{
				if(err) return res.status(500).send({message: 'Error en la petición'});

				if(!productoUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

				return res.status(200).send({producto: productoUpdated});
			 });

		}else{
			return removeFilesOfUploads(res, file_path, 'Extensión no válida');
		}

	}else{
		return res.status(200).send({message: 'No se han subido imagenes'});
	}
}

function removeFilesOfUploads(res, file_path, message){
	fs.unlink(file_path, (err) => {
		return res.status(200).send({message: message});
	});
}

function getImageFile(req, res){
	var image_file = req.params.imageFile;
	var path_file = './uploads/publications/'+image_file;

	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}




module.exports = {
	saveProducto,
	getProducto,
	getProductoUser,
	uploadImage,
	getImageFile
}