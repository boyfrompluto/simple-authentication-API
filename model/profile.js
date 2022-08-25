const mongoose = require("mongoose"); 


const profileSchema = new mongoose.Schema({
    fullname: {
        type: String,
        min: 6,
        default:"",
    },
    age:{
        type: String,
        default:"",
    },
    phonenumber: {
        type: String,
        default:"",
    },
    photo: {
        data: Buffer,
        contentType:String,
        default:"",
    },
   username: {
        type: String,
        required: true,
       min: 6 ,
       default:"",
    },
    email: {
        type: String,
        required: true,
        min: 6 
        
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports= mongoose.model('Profile',profileSchema)
