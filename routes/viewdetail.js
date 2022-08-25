const router = require("express").Router();
const express= require("express");
const User = require("../model/user");
const Profile = require("../model/profile");
const verify = require("../middleware/validatetoken");
const multer = require("multer")
const dotenv = require("dotenv").config();
const {editprofile}= require('../validation');


const app = express();
app.use(express.json());

const Storage = multer.diskStorage({
  destination: 'photoUploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({
  storage: Storage
});
router.post("/details", upload.single("image"), verify, async (req, res) => {
  const valid = await User.findOne({ email: req.user.email })
  if (!valid) return res.status(400).send("access denied")
  else {
    
    const {error}=editprofile(req.body);
  if (error) return res.status(400).send("error");

  try {
  const image = req.file;
   
    
    const fillDetails = await User.findOneAndUpdate({ email: req.user.email }, {
      fullname: req.body.fullname,
      age: req.body.age,
      phonenumber: req.body.phonenumber,
      photo:image,
      
    })
    if (!fillDetails) {
      res.status(400).send("unable to update details")
    }
    if (fillDetails) {
      res.send("profile updated successfully")
    }


  } catch (error) {
    console.log(error)
    res.status(400).send("error check full code")
  }
  }
})


module.exports = router;