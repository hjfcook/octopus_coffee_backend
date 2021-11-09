const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = function(app) {
    app.post("/login", (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) throw err;
            if (!user) res.send("No User Exists");
            else {
                req.logIn(user, (err) => {
                    if (err) throw err;
                    res.send("Successfully Authenticated");
                    // res.send(req.user);
                    console.log(req.user);
                });
            }
        })(req, res, next);
    });

    app.post('/register', (req, res) => {
        User.findOne({email : req.body.email}, async (err, doc) => {
            if (err) throw err;
            if (doc) res.send('User already exists');
            if (!doc) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                // const newUser = new User({
                //     username: req.body.username,
                //     password: hashedPassword
                // });
                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hashedPassword
                });
                await newUser.save();
                res.send('User created');
            }
        })
    });
    app.get('/user', (req, res) => {
        console.log(req.user)
        if (req.user) {
            res.send(req.user);
        } else {
            res.send({loggedOut: true});
        }
    });
    app.get("/logout", (req, res) => {
      req.logout();
      res.send({loggedOut: true});
    });
};