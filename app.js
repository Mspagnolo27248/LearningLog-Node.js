const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');
const { stringify } = require('querystring');


//Schemas
const noteSchema = {
    name: String,
    details: String,
    skill:String,
    focus:String,
    area:String
};
const skillSchema = {
    name: String,
    focus:String,
    area:String
};

const focusSchema = {
    name: String,
    area:String
};

const areaSchema = {
    name: String,
   
};

// Models
const Notes = mongoose.model('Notes', noteSchema);
const Skills = mongoose.model('Skills', skillSchema);
const Focus = mongoose.model('Focus', focusSchema);
const Area = mongoose.model('Area', areaSchema);


//DB Connection'
const password = process.env.PASSWORD 
if (password==null||password==""){
    password = ""
}
const dbUrl = "mongodb+srv://mspagnolo-admin:"+password+"@cluster0.lxizv.mongodb.net/LearningLog?retryWrites=true&w=majority"
mongoose.connect(dbUrl);



//Global Variables
const areas_data = [{ id_: 1, name: "Finance" }, { id_: 2, name: "Tech" }, { id_: 3, name: "History" }]
const focus_data = [{ id_: 1, name: "Node.JS" }, { id_: 2, name: "Python" }, { id_: 3, name: "SQL" }]
const skills_data = [{ id_: 1, name: "Routes" }, { id_: 2, name: "ODM" }, { id_: 3, name: "EJS" }]
const notes_data = [{ id_: 1, name: "basic routes", notes: "This is the basic route ..." }, { id_: 2, name: "NPM install", notes: "npm is how you install packages" }]

//App settings
const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Routes
app.get("/", function (req, res) {
    Area.find({}, function (err, data) {
        if (!err) {
            res.render('index', { areas_data: data })
        }
        else {
            console.log(err)
        }
    })
});


app.post("/", function (req, res) {
    const newArea = new Area({
        name: req.body.newItem,
    });
    newArea.save();
    res.redirect("/")
});


app.get("/area/:area_id", function (req, res) {
    const area = req.params.area_id;
    Focus.find({ area: area}, function (err, data) {
        if (!err) {
            if(!data){
            res.render("area", { area: area, focus_data: undefined });  
            }
            else{
            res.render("area", { area: area, focus_data: data });
            }
        }
        else {
            console.log(err);
        }

        })

});

app.post("/area/:area_id", function (req, res) {
    const area = req.params.area_id;
    const newFocus = new Focus({
        name: req.body.newItem,
        area:area
    })
    newFocus.save()
    res.redirect("/area/"+area);
 
});


app.get("/area/:area_id/focus/:focus_id", function (req, res) {
    const focus_ = req.params.focus_id;
    const area = req.params.area_id;

    Skills.find({area:area,focus:focus_},function(err,data){
        if(!err){
        if(!data){
            res.render('focus',{ area:area,focus: focus_, skills_data: undefined })
            
        }
        else{
            res.render('focus', { area:area,focus: focus_, skills_data: data })
        }
        
        }
        else{
            console.log(err)
        }
    })
   
});


app.post("/area/:area_id/focus/:focus_id" ,function (req, res) {
    const area  = req.params.area_id
    const focus_ = req.params.focus_id
    const skill = req.body.newItem
    const newItem = new Skills({
        name: skill,
        area:area,
        focus:focus_
    });
    newItem.save()
    res.redirect("/area/"+area+"/focus/"+focus_)
    });




app.get("/area/:area_id/focus/:focus_id/skill/:skill_id", function (req, res) {
    const area  = req.params.area_id
    const focus_ = req.params.focus_id
    const skill = req.params.skill_id
    Notes.find({area:area,focus:focus_,skill:skill},function (err,data) {
        if(!err){
            if(data){
                res.render('skills', {area:area,focus:focus_ ,skill: skill, notes_data: data })
            }
            else{
                res.render('skills', { area:area,focus:focus_ ,skill: skill, notes_data: undefined }) 
            }
        }   

    });
});

app.post("/area/:area_id/focus/:focus_id/skill/:skill_id", function (req, res) {
    const area  = req.params.area_id
    const focus_ = req.params.focus_id
    const skill = req.params.skill_id;

    const note = req.body.newItem;
    const desc = req.body.desc.replace(/(?:\r\n|\r|\n)/g, '<br>');
 
    const newNote = new Notes({
        name: note,
        details: desc,
        skill:skill,
        focus:focus_,
        area:area
    });

    newNote.save();
    res.redirect(/area/+area+"/focus/"+focus_+"/skill/"+skill)

});

app.post("/delete/:note",function (req,res) {
    const note_id = req.params.note;
    const area = req.body.area;
    const focus_ = req.body.focus;
    const skill = req.body.skill;
   Notes.deleteOne({_id:note_id},function(err){
       if(err){
           console.log(err)

       }
       else{
           console.log("Item Deleted")
       }
   }); 
   res.redirect(/area/+area+"/focus/"+focus_+"/skill/"+skill)
});
//Run app
let port = process.env.PORT;
if(port==null||port==""){
    port = 3000;
}

app.listen(port, function () {
    console.log("Server started on port 3000")
});