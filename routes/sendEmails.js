const router = require("express").Router();
const verify = require("../middleware/validatetoken");
const User = require("../model/user");
const Profile=  require("../model/profile");
const bcrypt = require('bcryptjs');
const express= require("express")
const Tokens=require("../model/tokensdb");
const jwt = require("jsonwebtoken");
const _ = require("lodash")
const app = express()
const dotenv = require("dotenv").config();
const mailgun = require("mailgun-js");
const api_key="3ae603883451a75aed49e6d1e6cfb7de-50f43e91-b3a79b64"
const DOMAIN = 'sandboxced8857b2d8444559534cc0f232d823e.mailgun.org';
const mg = mailgun({apiKey: api_key, domain: DOMAIN});



app.use(express.json())

router.post('/mail',async (req, res) => {

    const valid = await User.findOne({ email: req.user.email });
  
        
        const RETRIVE_PASSWORD = " 123QWE";
        const CLIENT_URI = 'localhost:3030';
        const email = req.body.email;
    
        const emailExist = await User.findOne({ email: req.body.email });
    
            if (!emailExist) {
                return res.status(400).json("fix error001")
        };
       
        const resetToken =await  jwt.sign({ email: req.body }, "" + RETRIVE_PASSWORD, { expiresIn: "2h" });
        console.log(resetToken)
        const data = {
            from: 'check mail<noreply@gmail.com>',
            to: req.body.email,
            subject: 'testmail',
            text: `${resetToken}`
        };
        console.log(data)
        await mg.messages().send(data, function (error, body) {
            // console.log(body)
            console.log(error)
    
        });
        const upUser=await User.findOneAndUpdate({email:req.body.email},{resetToken:resetToken})
        if (!upUser) return res.status(400).json("sorry fix error 100");
        if (upUser) return res.send("email sent");
    

});
router.post("/reset",  async (req, res) => {
    
    const RETRIVE_PASSWORD = " 123QWE";
   
    const resetToken = await req.body.resetToken;
    const newPassword = await req.body.newPassword;


    try {

        const vtoken = jwt.verify(resetToken, RETRIVE_PASSWORD);
        if (!vtoken) return res.status(400).send("error 003");
        const checkToken= await User.findOne({resetToken:resetToken})
        if (!checkToken) return res.send("error 002 unknown token");
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(newPassword, salt)
        console.log(encryptedPassword);
        
        User.findOneAndUpdate({resetToken:resetToken},{ password: encryptedPassword }, (error, success) => {
            if (error) {
                res.status(400).send("error 003 fix it")
            } else {
                res.send("password saved")
            };
        });
    } catch(error){
        return res.status(400).send("fix auth error")
    }
})


module.exports = router;