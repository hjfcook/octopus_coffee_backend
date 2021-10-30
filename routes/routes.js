const passport = require('passport');
const bcrypt = require('bcryptjs');
const Coffee = require('../models/coffee');
const User = require('../models/user');

module.exports = function(app) {
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
        User.findOne({username : req.body.username}, async (err, doc) => {
            if (err) throw err;
            if (doc) res.send('User already exists');
            if (!doc) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const newUser = new User({
                    username: req.body.username,
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