const mongoose = require('mongoose')

const minischema = mongoose.Schema({
    ProductName: {
        type: String,

    },
    ProductPara: {
        type: String
    }
})

const UserSchema = mongoose.Schema({
    Username: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        // default:'abc@gmail.com'

    },
    listim: {
        type: [minischema]
    }

}, { timeStamps: true })

const User = mongoose.model('user', UserSchema)

module.exports = User

