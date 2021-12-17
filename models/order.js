const mongoose = require("mongoose");

const customer = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    address: String,
  },
  { _id: false }
);

const item = new mongoose.Schema(
  {
    name: String,
    price: Number,
    quantity: Number,
  },
  { _id: false }
);

const order = new mongoose.Schema({
  customer: customer,
  items: [item],
  date: Date,
  total: Number,
});

module.exports = mongoose.model("Order", order);
