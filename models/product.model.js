const mongoose = require('mongoose');



const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productImg: {
        type: [String],
        required: true
    },
    Sizes: {
        type: [String],

    },
    price: {
        type: Number,
    },
    DiscountPrice: {
        type: Number,
    },
    Tag: {
        type: String
    },
    Description: {
        type: String
    },
    Categorey: {
        type: String
    },
    Keyword: {
        type: [String]
    }
}, { timeStamps: true })

const Product = mongoose.model('Product', productSchema);

module.exports = Product

