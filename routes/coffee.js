const Coffee = require('../models/coffee');

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
            description: description,
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

    app.put('/api/coffee/:id', (req, res) => {
        const id = req.params.id;
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
            description: description,
            descriptors: [descriptor1, descriptor2, descriptor3]
        };
        Coffee.findByIdAndUpdate(id, coffeeObject, {new: true}, (err, coffee) => {
            if (err) return console.error(err);
            // if (err || !coffee) return console.error(err);
            // res.send(coffeeObject);
            res.send(coffee);
        });
    });

    app.delete('/api/coffee/:id', (req, res) => {
        const id = req.params.id;
        Coffee.findByIdAndDelete(id, (err, coffee) => {
            if (err) return console.error(err);
            res.send({deleted: true});
        });
    });
};