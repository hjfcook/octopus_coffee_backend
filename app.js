// ------------------ IMPORTS ---------------------------
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
// const bcrypt = require('bcryptjs');
const session = require('express-session');

var app = express();

require('dotenv').config();
const MONGO_URI = process.env['MONGO_URI'];
mongoose.connect(
    MONGO_URI, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    },
    () => {
        console.log('Connected to database');
    }
);


// ----------------- MIDDLEWARE -------------------------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: "http://localhost:5000",
    credentials: true
}));
app.use(session({
    secret: 'this is my top secret string',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
require('./auth/passport-config')(passport);


// ------------------- ROUTES ---------------------------

require('./routes/coffee')(app);
require('./routes/users')(app);


// ------------------- EXPORT ---------------------------
module.exports = app;