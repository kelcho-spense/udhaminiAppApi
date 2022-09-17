const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');


//middlewares
dotenv.config();
app.use(express.json()); //app is able to send JSON requests
app.use("/images", express.static(path.join(__dirname, '/images'))); //using path lib to acess images in folders

//connect to mongodb
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("connected to mongodb"))
.catch((err) =>console.log(err));

//storage to store images using multer library
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'images');
    },
    filename: (req,file,cb) => {
        cb(null, req.body.name); 
    }
}); 
//upload file
const upload = multer({storage:storage});
//set upload route
app.post('/api/upload', upload.single('file') ,(req,res) =>{
    res.send("File has been Uploaded");
}); 

//define my routes
app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);

//server running port
app.listen(process.env.PORT || 5000,() => {
    console.log('Server running');
});