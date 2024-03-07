const mongoose = require('mongoose');


const miniLines = mongoose.Schema({
    heading:{
        type:String,
        required:true
    },
    headPara:{
        type:String,
        required:true
    },
})

const productSchema = mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    productImg:{
        type:String,
        required:true
    },
    Sizes:{
        type:[String],
        required:true
    },
    BoldDesc:{
        type:[miniLines]
    },
    para:{
        type:[String]
    }
},{ timeStamps: true })

const details = mongoose.model('Desc',productSchema);

module.exports = details

