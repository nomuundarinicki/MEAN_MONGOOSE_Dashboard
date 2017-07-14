const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(express.static(path.join(__dirname + '/static/')));
app.set('views', path.join(__dirname + '/views/'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost/mongoose_dashboard');
mongoose.Promise = global.Promise;

var AnimalSchema = new mongoose.Schema({
    name: String,
    description: String,
    type: String,
    }, { timestamps: true });

mongoose.model('Animal', AnimalSchema);
var Animal = mongoose.model('Animal');

app.get('/', function(req, res){

    console.log("In ROOT route")
    Animal.find({}, function(err, animals){
        if(err){
            console.log("There was an error with DB...")
            console.log("Errors: ", errors);
            res.render('index');
        }
        else {
            console.log("Query found animals: ", animals)
            res.render('index', {animals: animals});
        }
    });
});
app.get('/animal/new', function(req, res){

    console.log("In NEW animal route")
    res.render('newanimal');
});

app.post('/animal', function(req, res){
    console.log("In animal PROCESSING route")

    console.log(req.body);
    const animal = new Animal({name: req.body.animalname, description: req.body.animaldescription, type: req.body.animaltype});
    animal.save(function(err){
        if(err) {
            console.log('There was an error...');
        } else {
            console.log('successfully added animal...');
            res.redirect('/');
        }
    });
});
app.get('/animal/:id', function(req, res){
    console.log("In animalID route")
    console.log(req.params)

    Animal.findOne({"_id": req.params.id}, function(err, animal){
        if(err){
            console.log("There was an error with DB...")
            console.log("Errors: ", err);
            res.redirect('/');
        }
        else {
            console.log("Query found animal: ", animal)
            res.render('oneanimal', {animal: animal});
        }
    });
});
app.get('/animal/edit/:id', function(req, res){
    console.log("In animal EDIT route, displaying edit form")

        Animal.findOne({"_id": req.params.id}, function(err, animaledit){
        if(err){
            console.log("There was an error with DB...")
            console.log("Errors: ", err);
            res.redirect('/');
        }
        else {
            console.log("Query found animaledit: ", animaledit)
            res.render('editanimal', {animaledit: animaledit});
        }
    });
});
app.post('/animal/:id', function(req, res){
    console.log("In POST ANIMAL EDIT route")
    Animal.findOne({"_id": req.params.id}, function(err, animal){
        if(err){
            console.log("There was an error with DB...")
            console.log("Errors: ", err);
            res.redirect('/');
        }
        else {
            console.log(req.body)
            animal.name = req.body.editname;
            animal.description = req.body.editdescription;
            animal.type = req.body.edittype;
            animal.save(function (err) {
                if(err){
                console.log("There was an error with DB...")
                console.log("Errors: ", err);
                res.redirect('/');
            } else {
                console.log("Query found animal: ", animal)
                res.render('oneanimal', {animal: animal});
                }
            });
        }
    });
});
app.get('/animal/destroy/:id', function(req, res){

    console.log("In DESTROY route")
    Animal.remove({"_id": req.params.id}, function(err, animal){
        if(err){
            console.log("There was an error with DB...")
            console.log("Errors: ", err);
            res.redirect('/');
        }
        res.redirect('/');
    });
});


port = 8000;

app.listen(port, function () {
    console.log("Listen on port", port);
})
