const mongoose = require('mongoose');

const coffeeSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  continent: String,
  country: String,
  process: String,
  price: Number,
  roast: String,
  description: String,
  descriptors: [String]
});

module.exports = mongoose.model('Coffee', coffeeSchema);