'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas
var producto_routes = require('./routes/producto');
var venta_routes = require('./routes/venta');
var anulacion_routes = require('./routes/anulacion');
var cuentacorriente_routes = require('./routes/cuentacorriente');
var user_routes = require('./routes/user');
var compra_routes = require('./routes/compra');
var proveedor_routes = require('./routes/proveedor');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');
var message_routes = require('./routes/message');

// middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

// rutas
app.use('/api', producto_routes);
app.use('/api', venta_routes);
app.use('/api', cuentacorriente_routes);
app.use('/api', anulacion_routes);
app.use('/api', user_routes);
app.use('/api', proveedor_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', message_routes);
app.use('/api', compra_routes);

// exportar
module.exports = app;