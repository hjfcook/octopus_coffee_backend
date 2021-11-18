const Coffee = require('../models/coffee');
const isAdmin = require('../middleware/isAdmin');
const coffeeValidation = require('../middleware/coffeeValidation');

module.exports = function(app) {
  app.post('/api/coffee', isAdmin, coffeeValidation, (req, res) => {
    const newCoffee = Coffee(req.coffeeObject);
    newCoffee.save((err, coffee) => {
      if (err) throw err;
      res.send({
        status: "success",
        data: coffee
      });
    });
  });

  app.get('/api/coffee', (req, res) => {
    Coffee.find({}, (err, coffees) => {
      if (err) throw err;
      res.send({
        status: "success",
        data: coffees
      });
    });
  });

  app.put('/api/coffee/:id', isAdmin, coffeeValidation, (req, res) => {
    const id = req.params.id;
    Coffee.findByIdAndUpdate(id, req.coffeeObject, {new: true}, (err, coffee) => {
      if (err) throw err;
      res.send({
        status: "success",
        data: coffee
      });
    });
  });

  app.delete('/api/coffee/:id', isAdmin, (req, res) => {
    const id = req.params.id;
    Coffee.findByIdAndDelete(id, (err, coffee) => {
      if (err) throw err;
      res.send({
        status: "success",
        data: null
      });
    });
  });
};