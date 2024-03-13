const express = require('express');
const { createProduct, getProduct, getProductByName, deleteProductById, getAllCategoreyNameAndLength, updateProductById, getProductByCategoreysName } = require('../controlers/productCont');
const multer = require('multer');
const { CreateOrder } = require('../controlers/Ordercontrollers');
const { createContact, getContacts } = require('../controlers/ContactControllers');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); 
const route = express.Router()

route.post("/create-product", upload.array('file'), createProduct);

route.get("/all-products",getProduct);
route.get("/single-product/:prodName",getProductByName);
route.get("/Categorey-product/:prodName",getProductByCategoreysName);

route.delete("/delete-product/:id",deleteProductById);
route.get("/AllCategoreys",getAllCategoreyNameAndLength);
route.post("/Update-Product/:id",updateProductById);
route.post("/Make-Order",CreateOrder);
route.post("/Contact",createContact);
route.get("/get-contact",getContacts);







module.exports = route
