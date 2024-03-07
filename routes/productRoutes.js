const express = require('express');
const { createProduct, getProduct, getProductByName } = require('../controlers/productCont');

const route = express.Router()

route.post("/create-product",createProduct);

route.get("/all-products",getProduct);
route.get("/single-product/:prodName",getProductByName);

module.exports = route