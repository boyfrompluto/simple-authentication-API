const Profile = require("../model/profile");
const multer = require("multer");
const router = require("express").Router();
const User = require("../model/user");

const Storage = multer.diskStorage({
    destination: 'photoUploads',
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  const upload=multer({
    storage:Storage
  }).single("testImage")

router.post('/upload', (req, res) => {
    const emailExist = User.findOne({ email: req.body.email });
    if (!emailExist) {
        res.status(400).send('access denied')
    }
    else {
        try {
            upload(req, res, (error)=> {
                if(error) {
                        res.status(400).send("fix error 100")
                    }
                else {
                    const image={
                        data: req.file.filename,
                        contentType: 'image/png' || 'image/jpg'}
                    const upPic=User.findOneAndUpdate({email:req.body.emal},{ photo: image})
                        if (!upPic) {
                            res.status(400).send(error)
                        } if(upPic){
                            res.json("uploaded")
                            console.log(image)
                        }
                    
                    }
                })
        } catch {
            res.status(400).send("fix error")
        }
    }
   
})
module.exports = router;