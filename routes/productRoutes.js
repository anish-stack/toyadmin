const express = require('express');
const { createProduct, getProduct, getProductByName, deleteProductById, getAllCategoreyNameAndLength, updateProductById } = require('../controlers/productCont');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); 
const route = express.Router()

route.post("/create-product", upload.array('fileInputFieldName'), createProduct);

route.get("/all-products",getProduct);
route.get("/single-product/:prodName",getProductByName);
route.delete("/delete-product/:id",deleteProductById);
route.get("/AllCategoreys",getAllCategoreyNameAndLength);
route.post("/Update-Product/:id",updateProductById);




module.exports = route