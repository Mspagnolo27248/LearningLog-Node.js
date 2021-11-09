const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');
const { stringify } = require('querystring');


//Schemas
const noteSchema = {
    name: String,
    details: String
};
const skillSchema = {
    name: String,
    notes: [noteSchema]
};

const focusSchema = {
    name: String,
    skills: [skillSchema]
};

const areaSchema = {
    name: String,
    areas: [focusSchema]
};

// Models
const Notes = mongoose.model('Notes', noteSchema);
const Skills = mongoose.model('Skills', skillSchema);
const Focus = mongoose.model('Focus', focusSchema);
const Area = mongoose.model('Area', areaSchema);


//DB Connection'
const dbUrl = "mongodb+srv://mspagnolo-admin:orange11@cluster0.lxizv.mongodb.net/LearningLog?retryWrites=true&w=majority"
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
        areas: []
    });
    newArea.save();
    res.redirect("/")
});


app.get("/area/:area_id", function (req, res) {
    const area = req.params.area_id;
    Area.findOne({ name: area }, function (err, data) {
        if (!err) {
            if (!data) {
                newArea = new Area({ name: area, areas: [] });
                newArea.save();
                res.redirect("/area/" + area);
            }
            else {
                res.render("area", { area: area, focus_data: data.areas });
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
        skills: []
    }
    );
    Area.findOne({ name: area }, function (err, data) {
        if (!err) {
            data.areas.push(newFocus);
            data.save();
            res.redirect("/area/" + area);
        }
        else {
            console.log(err);
        }
    })
});


app.get("/area/:area_id/focus/:focus_id", function (req, res) {
    const focus_ = req.params.focus_id;
    const area = req.params.area_id;

    Area.findOne({"areas.name":focus_},function(err,data){
        if(!err){
        res.render('focus', { focus_: focus_, skills_data: data.skills })
        }
        else{
            console.log(err)
        }
    })
   
});


app.post("/focus/:focus_id", function (req, res) {
    const focus_ = req.params.focus_id
    const newItem = new Skills({
        name: req.body.newItem,
        notes: []
    });
    Focus.findOne({ name: focus_ }, function (err, data) {
        if (!err) {
            data.skills.push(newItem);
            data.save();
            res.redirect('/focus/' + focus_)
        }
        else {
            console.log(err);
        }
    });
});


app.get("/skill/:skill_id", function (req, res) {
    const skill = req.params.skill_id
   res.render('skills', { skill: skill, notes_data: notes_data })
});

app.post("/skill/:skill_id", function (req, res) {
    const skill = req.params.skill_id;
    const newNote = new Notes({
        name: req.body.newItem,
        details: ""
    }
    );
    Area.findOne({ name: skill }, function (err, data) {
        if (!err) {
            data.areas.push(newNote);
            data.save();
            res.redirect("/skill/" + skill);
        }
        else {
            console.log(err);
        }
    })
});
//Run app

app.listen(3000, function () {
    console.log("Server started on port 3000")
});