const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

//DB Connection'
/**
* const dbUrl = "mongodb+srv://mspagnolo-admin:orange11@cluster0.lxizv.mongodb.net/Blogs?retryWrites=true&w=majority"
* mongoose.connect(dbUrl);
* const Post = mongoose.model('Post',{title:String,post:String});
*/


//Global Variables
//const var1 = 1



//App settings
const app = express()
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//Routes
app.get("/",function (req,res){
res.render('index')
});
//Run app

app.listen(3000,function(){
    console.log("Server started on port 3000")
});