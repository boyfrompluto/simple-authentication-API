const router = require("express").Router();
const verify = require("../middleware/validatetoken");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../model/user");


router.get('/', verify, async (req, res) => {
    const valid =await User.findOne({ email: req.user.email })
    if (!valid) {
        res.status(400).send("access denied")
    } else {
        console.log(valid)
        res.json({
            posts: {
                title: 'an ordinary post',
                description: 'qnjnekmnknflk;vkmobmfk;blmk random shit'
            }
        });
    }
});

module.exports = router;