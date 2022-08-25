const router = require("express").Router();
const express= require("express")
const User = require("../model/user")
const  bcrypt = require ('bcryptjs')
const { registerValidation,loginValidation } = require('../validation');
const app = express()
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv").config()
const mailgun = require("mailgun-js");
const api_key="3ae603883451a75aed49e6d1e6cfb7de-50f43e91-b3a79b64"
const DOMAIN = 'sandboxced8857b2d8444559534cc0f232d823e.mailgun.org';
const mg = mailgun({apiKey: api_key, domain: DOMAIN});



app.use(express.json())
// signup
router.post('/register', async (req, res) => {
    //VALIDATE NEW USER
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    try {
        //CHECK IF USER ALREADY EXIST
        const emailExist = await User.findOne({ email: req.body.email });
        if (emailExist) return res.status(400).send('email already exists');

        //COVER PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        
        //CREATE NEW USER
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
           
        });
        const MAIL_SECRET = '123QWE';
        const token = jwt.sign({email: user.email },""+MAIL_SECRET,{expiresIn: "2h"});
        res.header('auth-token', token).send("account created");

        const data = {
            from: 'check mail<noreply@gmail.com>',
            to:req.body.email,
            subject: 'testmail',
            text: 'Testing some Mailgun awesomness!'
        };
        console.log(data)
        await mg.messages().send(data, function (error, body) {
            console.log(body)
            console.log(error)
    
        });
        const savedUser = await user.save()
        console.log(savedUser);
       
    } catch (error) {
        res.status(400).send(error)
     
    }
});

//LOGIN
router.post('/login', async(req, res)=> {
     //VALIDATE NEW USER
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json(error.details[0].message);
    
      //CHECK IF USER  EXISTS
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json('WRONG EMAIL OR PASSWORD');
    
    //CONFIRM  PASSWORD
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(400).json("WRONG PASSWORD OR EMAIL")
    //USER SESSION TOKEN
    
    const token = jwt.sign({email:req.body.email },process.env.TOKEN_SECRET);
    res.header('token', token).send(token);
    console.log(token)
    // res.send("LOGGED IN")
})




module.exports = router;
