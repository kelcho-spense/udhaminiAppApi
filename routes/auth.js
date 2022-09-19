const router = require('express').Router();
const User = require('../models/User'); //user model
const bcrypt = require('bcrypt');

//REGISTER
router.post('/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username });
        if (!existingUser) {
            const existingEmail = await User.findOne({ email: req.body.email });
            if (!existingEmail) {
                const hashedPass = await bcrypt.hash(req.body.password, salt);
                const newUser = new User({
                    fullname: req.body.fullname,
                    age: req.body.age,
                    gender: req.body.gender,
                    education_level: req.body.education_level,
                    gpa: req.body.gpa,
                    country: req.body.country,
                    profilepic: req.body.profilepic,
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPass,
                });
                const salt = await bcrypt.genSalt(10);            
                const user = await newUser.save();
                const { password, ...others } = user._doc;
                res.status(200).json(others);
            } else {
                return res.send("Email already taken"); 
            }            
        } else {
            return res.send("Username already taken");
        }
    } catch (err) {
        res.status(500).json(err);
    };
});
//LOGIN

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            const validated = await bcrypt.compare(req.body.password, user.password);
            if (validated) {
                const { password, ...others } = user._doc; //filter out password from the obj returned
                res.status(200).json(others);
            } else {
                res.status(400).json("Wrong Credentials");
            }
        } else {
            res.status(400).json("Wrong Credentials");
        }
    } catch (err) {
        res.status(500).json(err);
    };
    });

module.exports = router