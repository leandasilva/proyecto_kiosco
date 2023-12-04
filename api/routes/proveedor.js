'use strict'

var express = require('express');
var ProveedorController = require('../controllers/proveedor');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/proveedor'});

api.post('/nuevo-proveedor', md_auth.ensureAuth ,ProveedorController.saveProveedor);
api.get('/proveedor/:id', md_auth.ensureAuth,ProveedorController.getProveedor);
api.get('/proveedores/:page?', md_auth.ensureAuth,ProveedorController.getProveedorUser);
module.exports = api;