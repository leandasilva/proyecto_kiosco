'use strict'

var express = require('express');
var VentaController = require('../controllers/venta');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

api.post('/venta', md_auth.ensureAuth ,VentaController.saveVenta);
api.get('/detalle/:id', md_auth.ensureAuth, VentaController.getVenta);
api.get('/ventas/:page?', md_auth.ensureAuth, VentaController.getVentas);
module.exports = api;