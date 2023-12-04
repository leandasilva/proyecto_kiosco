'use strict'

var express = require('express');
var CompraController = require('../controllers/compra');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

api.post('/nueva-compra', md_auth.ensureAuth ,CompraController.saveCompra);
api.get('/compras/:page?', md_auth.ensureAuth,CompraController.getComprasUser);
module.exports = api;