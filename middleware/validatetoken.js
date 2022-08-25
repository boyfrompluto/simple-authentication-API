const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config()
module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const  token =authHeader && authHeader.split(" ")[1]
    if(token==null)return res.status(400).send("token error")
    else{
        try {
            jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
                if (error) return res.status(403).send("env error")
                req.user = user
                next()
            })
          
        } catch (err) {
            res.status(400).json("GOAT CHEESE");
        }
    }
};