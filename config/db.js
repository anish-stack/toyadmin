const mongoose = require('mongoose');

exports.connectDb = async () =>{
    try {
        await mongoose.connect(process.env.MONGOOURL);
        console.log("Database Connecting Suceesfully");
    } catch (error) {
        console.log("Error : ",error);
    }
}





