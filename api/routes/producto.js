'use strict'

var express = require('express');
var ProductoController = require('../controllers/producto');
var Producto = require('../models/producto');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/publications'});

api.post('/nuevo-producto',  md_auth.ensureAuth ,ProductoController.saveProducto);
api.get('/producto/:id', md_auth.ensureAuth, ProductoController.getProducto);
api.get('/productos/:page?', md_auth.ensureAuth, ProductoController.getProductoUser);
api.post('/getFruits',md_auth.ensureAuth, async (req,res)=>{
    let payload = req.body.payload;
let search = await Producto.find({codigo: {$regex: new RegExp('^'+payload+'.*',
    'i')}}).exec();
    
    search = search.slice(0,10);

    res.send({payload: search});
});
api.post('/upload-image-producto/:id', [md_auth.ensureAuth, md_upload], ProductoController.uploadImage);
api.get('/get-image-producto/:imageFile', ProductoController.getImageFile);
module.exports = api;