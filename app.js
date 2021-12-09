// ------------------ IMPORTS ---------------------------
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
// const bcrypt = require('bcryptjs');
const session = require("express-session");

const stripe = require("stripe")(
  "sk_test_51K4MEJIYNYXoDTIhLNxrv2jOL633FiZR39zVwODArdrK8qE0wSse9qZBsBZqFhM3VfoCw4esC0uBvJTy3Ddlp3RA00QlLXfeN3"
);

var app = express();

require("dotenv").config();
const MONGO_URI = process.env["MONGO_URI"];
mongoose.connect(
  MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    // console.log('Connected to database');
  }
);

// ----------------- MIDDLEWARE -------------------------
if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    // origin: "http://localhost:5000",
    // origin: "http://192.168.0.23:5000",
    // origin: "http://192.168.0.16:5000",
    // origin: "*",
    origin: true,
    credentials: true,
  })
);
app.use(
  session({
    secret: "this is my top secret string",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
require("./auth/passport-config")(passport);

// ------------------- ROUTES ---------------------------

require("./routes/coffee")(app);
require("./routes/users")(app);
require("./routes/auth")(app);

const DOMAIN = "http://localhost:5000";
app.post("/create-checkout-session", async (req, res) => {
  const cart = req.body.cart;
  const session = await stripe.checkout.sessions.create({
    line_items: cart.map((item) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    // success_url: `${DOMAIN}/?success=true`,
    success_url: `${DOMAIN}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${DOMAIN}/cart`,
  });
  res.send(session);
});

app.get("/order/success", async (req, res) => {
  try {
    // const session = await stripe.checkout.sessions.retrieve(
    const items = await stripe.checkout.sessions.listLineItems(
      req.query.session_id,
      { limit: 100 }
    );
    res.send({ status: "success", data: items });
  } catch (err) {
    res.send({ status: "error", error: err });
  }
  // const customer = await stripe.customers.retrieve(session.customer);
  // res.send({ status: "success", data: customer.name });
  // res.send({
  //   status: "success",
  //   data: { session: session, customer: customer },
  // });
});

// ------------------- EXPORT ---------------------------
module.exports = app;
