const mongoose = require("mongoose"); 


const tokenSchema = new mongoose.Schema({
   resetToken: {
        type:String,
        default:""
    }
})

module.exports= mongoose.model('Tokens',tokenSchema)