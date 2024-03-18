const express = require('express');
const { createProduct, getProduct, getProductByName, deleteProductById, getAllCategoreyNameAndLength, updateProductById, getProductByCategoreysName, removeAllCatch } = require('../controlers/productCont');
const multer = require('multer');
const { CreateOrder, getOrders, updateOrderStatus } = require('../controlers/Ordercontrollers');
const { createContact, getContacts } = require('../controlers/ContactControllers');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); 
const route = express.Router()

route.post("/create-product", createProduct);

route.get("/all-products",getProduct);
route.get("/single-product/:prodName",getProductByName);
route.get("/Categorey-product/:prodName",getProductByCategoreysName);

route.delete("/delete-product/:id",deleteProductById);
route.get("/AllCategoreys",getAllCategoreyNameAndLength);
route.post("/Update-Product/:id",updateProductById);
route.post("/Make-Order",CreateOrder);
route.get("/get-Order",getOrders);
route.post("/Update-Order",updateOrderStatus);


route.post("/Contact",createContact);
route.get("/get-contact",getContacts);
route.get("/Clear-cache",removeAllCatch);








module.exports = route