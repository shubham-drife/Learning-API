const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const product = require('../models/product');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');


const ProductController = require("../controllers/products");

router.get('/', ProductController.products_get_all);

router.post('/', checkAuth, ProductController.products_create_product);

router.get('/:productId', ProductController.products_get_product);

router.delete('/:productId', checkAuth, ProductController.products_delete_product);

router.patch('/:productId', checkAuth, ProductController.products_update_product );

module.exports = router;