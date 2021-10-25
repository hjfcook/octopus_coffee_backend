var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


const cors = require('cors');
app.use(cors());

require('dotenv').config();
const mongoose = require('mongoose');
const MONGO_URI = process.env['MONGO_URI'];
mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const Schema = mongoose.Schema;
const coffeeSchema = new Schema({
    name: String,
    continent: String,
    country: String,
    process: String,
    price: Number,
    roast: String,
    description: String,
    descriptors: [String]
});
const Coffee = mongoose.model('Coffee', coffeeSchema);



app.post('/api/coffee', (req, res) => {
    const name = req.body.name;
    const continent = req.body.continent;
    const country = req.body.country;
    const process = req.body.process;
    const price = req.body.price;
    const roast = req.body.roast;
    const description = req.body.description;
    const descriptor1 = req.body.descriptor1;
    const descriptor2 = req.body.descriptor2;
    const descriptor3 = req.body.descriptor3;
    const coffeeObject = {
        name: name,
        continent: continent,
        country: country,
        process: process,
        price: price,
        roast: roast,
        descript: description,
        descriptors: [descriptor1, descriptor2, descriptor3]
    };
    const newCoffee = Coffee(coffeeObject);
    newCoffee.save((err, coffee) => {
        if (err) return console.error(err);
        res.send(coffeeObject);
    });
});

app.get('/api/coffee', (req, res) => {
    Coffee.find({}, (err, coffees) => {
        if (err) return console.error(err);
        coffeeList = coffees.map(coffee => ({
            _id: coffee._id,
            name: coffee.name,
            continent: coffee.continent,
            country: coffee.country,
            process: coffee.process,
            price: coffee.price,
            roast: coffee.roast,
            description: coffee.description,
            descriptors: coffee.descriptors
        }));
        res.send(coffeeList);
    });
});





module.exports = app;