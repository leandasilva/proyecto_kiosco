'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

var User = require('../models/user');
var Cuentacorriente = require('../models/cuentacorriente');
var jwt = require('../services/jwt');
var Follow = require('../models/follow');
const user = require('../models/user');


// Registro
function saveCuentacorriente(req, res){
	var params = req.body;
	var cuentacorriente = new Cuentacorriente();

	if(params.nombre && params.apellido && 
	    params.domicilio && params.email){

	    cuentacorriente.nombre = params.nombre;
		cuentacorriente.apellido = params.apellido;
		cuentacorriente.domicilio = params.domicilio;
		cuentacorriente.dni = params.dni;
		cuentacorriente.telefono = params.telefono;
		cuentacorriente.email = params.email;
        cuentacorriente.monto = params.monto;
		cuentacorriente.imagen = null;
        cuentacorriente.user = req.user.sub;

		// Controlar usuarios duplicados
		Cuentacorriente.find({ $or: [
				 {email: cuentacorriente.email.toLowerCase()},
				 {nombre: cuentacorriente.nombre.toLowerCase()}
		 ]}).exec((err, cuentacorrientes) => {
		 	if(err) return res.status(500).send({message: 'Error en la petición de usuarios'});

		 	if(cuentacorrientes && cuentacorrientes.length >= 1){
		 		return res.status(200).send({message: 'El usuario que intentas registrar ya existe!!'});
		 	}else{

		 		// Cifra la password y me guarda los datos 
				bcrypt.hash(params.password, null, null, (err, hash) => {
				    user.password = hash;

				    cuentacorriente.save((err, cuentacorrienteStored) => {
						if(err) return res.status(500).send({message: 'Error al guardar el usuario'});

						if(cuentacorrienteStored){
							res.status(200).send({cuentacorriente: cuentacorrienteStored});
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
function getCuentacorriente(req, res){
	var cuentacorrienteId = req.params.id;

	Cuentacorriente.findById(cuentacorrienteId, (err, cuentacorriente) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!cuentacorriente) return res.status(404).send({message: 'El usuario no existe'});

		followThisUser(req.user.sub, cuentacorrienteId).then((value) => {
			user.password = undefined;

			return res.status(200).send({
				cuentacorriente,
				following: value.following, 
				followed: value.followed
			});
		});

	});
}

async function followThisUser(identity_cuentacorriente_id, user_id){
	var following = await Follow.findOne({"cuentacorriente":identity_cuentacorriente_id, "followed":user_id}).exec((err, follow) => {
			if(err) return handleError(err); 
			return follow;
		});

	var followed = await Follow.findOne({"cuentacorriente":user_id, "followed":identity_cuentacorriente_id}).exec((err, follow) => {
			if(err) return handleError(err); 
			return follow;
		});

	return {
		following: following,
		followed: followed
	}
}

async function followUserIds(cuentacorriente_id) {
    try {
        var following = await Follow.find({ 'cuentacorriente': cuentacorriente_id }).select({ '_id': 0, '__v': 0, 'cuentacorriente': 0 }).exec()
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
 
        var followed = await Follow.find({ 'followed': cuentacorriente_id }).select({ '_id': 0, '__v': 0, 'followed': 0 }).exec()
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


function getCuentacorrienteUser(req, res){
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var user = req.user.sub;
	if(req.params.user){
		user = req.params.user;
	}

	var itemsPerPage = 4;

	Cuentacorriente.find({user: user}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, cuentacorrientes, total) => {
		if(err) return res.status(500).send({message: 'Error devolver publicaciones'});

		if(!cuentacorrientes) return res.status(404).send({message: 'No hay publicaciones'});

		return res.status(200).send({
			total_items: total,
			pages: Math.ceil(total/itemsPerPage),
			page: page,
			items_per_page: itemsPerPage,
			cuentacorrientes
		});
	});

}


// Edición de datos de usuario
function updateCuentacorriente(req, res){
	var cuentacorrienteId = req.params.id;
	var update = req.body;

	// borrar propiedad password
	delete update.password;

	//if(cuentacorrienteId != req.user.sub){
	//	return res.status(500).send({message: 'No tienes permiso para actualizar los datos de la cuenta corriente'});
	//}

	Cuentacorriente.find({ $or: [
				 {email: update.email.toLowerCase()},
				 {nombre: update.nombre.toLowerCase()}
		 ]}).exec((err,cuentacorrientes ) => {
		 
		 	var cuentacorriente_isset = false;
		 	cuentacorrientes.forEach((cuentacorriente) => {
		 		if(cuentacorriente && cuentacorriente._id != cuentacorrienteId) cuentacorriente_isset = true;
		 	});

		 	if(cuentacorriente_isset) return res.status(404).send({message: 'Los datos ya están en uso'});
		 	
		 	Cuentacorriente.findByIdAndUpdate(cuentacorrienteId, update, {new:true}, (err, cuentacorrienteUpdated) => {
				if(err) return res.status(500).send({message: 'Error en la petición'});

				if(!cuentacorrienteUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

				return res.status(200).send({cuentacorriente: cuentacorrienteUpdated});
			});

		 });

}






// Subir archivos de imagen/avatar de usuario
function uploadImage(req, res){
	var cuentacorrienteId = req.params.id;

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

		if(userId != req.user.sub){
			return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos del usuario');
		}

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
			 
			 // Actualizar documento de usuario logueado
			 Cuentacorriente.findByIdAndUpdate(cuentacorrienteId, {image: file_name}, {new:true}, (err, cuentacorrienteUpdated) =>{
				if(err) return res.status(500).send({message: 'Error en la petición'});

				if(!cuentacorrienteUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

				return res.status(200).send({cuentacorriente: cuentacorrienteUpdated});
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
	var path_file = './uploads/cuentacorriente/'+image_file;

	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}

module.exports = {
	saveCuentacorriente,
	getCuentacorriente,
	getCuentacorrienteUser,
	updateCuentacorriente,
	uploadImage,
	getImageFile
}