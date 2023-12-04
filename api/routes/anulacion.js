'use strict'

var express = require('express');
var AnulacionController = require('../controllers/anulacion');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

api.post('/anulacion', md_auth.ensureAuth ,AnulacionController.saveAnulacion);
api.get('/anulado/:id', md_auth.ensureAuth, AnulacionController.getAnulacion);
api.get('/anulaciones/:page?', md_auth.ensureAuth, AnulacionController.getAnulaciones);
module.exports = api;