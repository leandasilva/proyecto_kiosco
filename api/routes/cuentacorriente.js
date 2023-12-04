'use strict'

var express = require('express');
var CuentacorrienteController = require('../controllers/cuentacorriente');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/cuentacorriente'});

api.post('/nueva-cuenta', md_auth.ensureAuth ,CuentacorrienteController.saveCuentacorriente);
api.get('/cuenta/:id', md_auth.ensureAuth,CuentacorrienteController.getCuentacorriente);
api.get('/cuentas/:page?', md_auth.ensureAuth,CuentacorrienteController.getCuentacorrienteUser);
api.put('/update-cuenta/:id', md_auth.ensureAuth, CuentacorrienteController.updateCuentacorriente);
api.post('/upload-image-cuenta/:id', [md_auth.ensureAuth, md_upload], CuentacorrienteController.uploadImage);
api.get('/get-image-cuenta/:imageFile', CuentacorrienteController.getImageFile);
module.exports = api;