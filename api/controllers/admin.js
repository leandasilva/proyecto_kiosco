'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

var Admin = require('../models/admin');
var Producto = require('../models/producto');
var jwt = require('../services/jwt');
var Follow = require('../models/follow');
const admin = require('../models/admin');


// Registro
function saveUser(req, res){
	var params = req.body;
	var admin = new Admin();

	if(params.nombre && params.apellido && 
	    params.email && params.password){

        admin.razonsocial = params.razonsocial;
		admin.nombre = params.nombre;
		admin.apellido = params.apellido;
		admin.domicilio = params.domicilio;
		admin.telefono = params.telefono;
		admin.email = params.email;
        admin.role = 'ROLE_USER';
		admin.image = null;

		// Controlar usuarios duplicados
		Admin.find({ $or: [
				 {email: admin.email.toLowerCase()},
				 {nombre: admin.nombre.toLowerCase()}
		 ]}).exec((err, admins) => {
		 	if(err) return res.status(500).send({message: 'Error en la petición de usuarios'});

		 	if(admins && admins.length >= 1){
		 		return res.status(200).send({message: 'El usuario que intentas registrar ya existe!!'});
		 	}else{

		 		// Cifra la password y me guarda los datos 
				bcrypt.hash(params.password, null, null, (err, hash) => {
				    admin.password = hash;

				    admin.save((err, adminStored) => {
						if(err) return res.status(500).send({message: 'Error al guardar el usuario'});

						if(adminStored){
							res.status(200).send({admin: adminStored});
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

// Login
function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	Admin.findOne({email: email}, (err, admin) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(admin){
			bcrypt.compare(password, admin.password, (err, check) => {
				if(check){
					
					if(params.gettoken){
						//generar y devolver token
						return res.status(200).send({
							token: jwt.createToken(admin)
						});
					}else{
						//devolver datos de usuario
						admin.password = undefined;
						return res.status(200).send({admin});
					}
					
				}else{
					return res.status(404).send({message: 'El usuario no se ha podido identificar'});
				}
			});
		}else{
			return res.status(404).send({message: 'El usuario no se ha podido identificar!!'});
		}
	});
}


// Conseguir datos de un usuario
function getUser(req, res){
	var adminId = req.params.id;

	Admin.findById(adminId, (err, admin) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!admin) return res.status(404).send({message: 'El usuario no existe'});

		followThisUser(req.user.sub, adminId).then((value) => {
			admin.password = undefined;

			return res.status(200).send({
				admin,
				following: value.following, 
				followed: value.followed
			});
		});

	});
}

async function followThisUser(identity_admin_id, admin_id){
	var following = await Follow.findOne({"admin":identity_admin_id, "followed":admin_id}).exec((err, follow) => {
			if(err) return handleError(err); 
			return follow;
		});

	var followed = await Follow.findOne({"admin":admin_id, "followed":identity_admin_id}).exec((err, follow) => {
			if(err) return handleError(err); 
			return follow;
		});

	return {
		following: following,
		followed: followed
	}
}

async function followUserIds(admin_id) {
    try {
        var following = await Follow.find({ 'admin': admin_id }).select({ '_id': 0, '__v': 0, 'admin': 0 }).exec()
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
 
        var followed = await Follow.find({ 'followed': admin_id }).select({ '_id': 0, '__v': 0, 'followed': 0 }).exec()
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
function getProductos(req, res){
	var identity_admin_id = req.user.sub;

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 5;

	Producto.find().sort('_id').paginate(page, itemsPerPage, (err, productos, total) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!productos) return res.status(404).send({message: 'No hay usuarios disponibles'});

		followUserIds(identity_admin_id).then((value) => {
			
			return res.status(200).send({
				productos,
				///users_following: value.following,
				//users_follow_me: value.followed,
				total,
				pages: Math.ceil(total/itemsPerPage)
			});
		
		});

	});	
}


// Edición de datos de usuario
function updateUser(req, res){
	var adminId = req.params.id;
	var update = req.body;

	// borrar propiedad password
	delete update.password;

	if(adminId != req.user.sub){
		return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});
	}

	Admin.find({ $or: [
				 {email: update.email.toLowerCase()},
				 {nombre: update.nombre.toLowerCase()}
		 ]}).exec((err, admins) => {
		 
		 	var admin_isset = false;
		 	admins.forEach((admin) => {
		 		if(admin && admin._id != adminId) admin_isset = true;
		 	});

		 	if(admin_isset) return res.status(404).send({message: 'Los datos ya están en uso'});
		 	
		 	Admin.findByIdAndUpdate(adminId, update, {new:true}, (err, adminUpdated) => {
				if(err) return res.status(500).send({message: 'Error en la petición'});

				if(!adminUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

				return res.status(200).send({admin: adminUpdated});
			});

		 });

}




// Edición de datos de usuario
function updateProducto(req, res){
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


// Subir archivos de imagen/avatar de usuario
function uploadImage(req, res){
	var adminId = req.params.id;

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

		if(adminId != req.user.sub){
			return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos del usuario');
		}

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
			 
			 // Actualizar documento de usuario logueado
			 Admin.findByIdAndUpdate(adminId, {image: file_name}, {new:true}, (err, adminUpdated) =>{
				if(err) return res.status(500).send({message: 'Error en la petición'});

				if(!adminUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

				return res.status(200).send({admin: adminUpdated});
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
	var path_file = './uploads/users/'+image_file;

	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}

module.exports = {
	saveUser,
	loginUser,
	getUser,
	getProductos,
	updateUser,
	updateProducto,
	uploadImage,
	getImageFile
}