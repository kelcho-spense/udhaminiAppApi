const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt'); 
//UPDATE
router.put("/:id",async (req,res)=>{
    if(req.body.userId == req.params.id){
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password,salt);
            req.body.password = hashedPassword;
        }
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
              $set: req.body,
            },{new: true});
            res.status(200).json(updatedUser);            
        }catch(err){
            res.status(500).json(err);
        }
    } else {
        res.status(401).json("Unauthorized:you can only update your account!");
    }   
});

//DELETE
router.delete("/:id", async (req,res)=>{
    if(req.body.userId == req.params.id){
        try {
            const user = await User.findById(req.params.id); //check if the user exists via id
            try{
                await Post.deleteMany({username:User.username}); //in Post schema, we use username and compares usernames in User schema then delete if they exist
                await User.findByIdAndDelete(req.params.id);    //we delete the user via id        
                res.status(200).json("User has been deleted!");
             }catch(err){
                res.status(500).json(err);
            }
            
        } catch (error) {
            res.status(500).json("user not found!");            
        }
        
        
    } else {
        res.status(401).json("Unauthorized:you can only delete on your account!");
    }
   
});

//GET USER
router.get("/:id",async (req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        const { password ,...others} = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json("user not found!");
    }
});
module.exports = router