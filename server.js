const express = require('express');   // 1st
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDb } = require('./configue/db');

const productRoute = require('./routes/productRoutes')
dotenv.config()

connectDb()

const app = express();
// const port = 8000;
const port = process.env.PORT;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
app.use("/api/v1",productRoute)

app.get("/",(req,res)=>{
    res.send("Hey.. ")
})
app.listen(port,()=>{
    console.log("Our Server is running on ",port);
})
