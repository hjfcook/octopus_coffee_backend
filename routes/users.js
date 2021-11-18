const passport = require("passport");
// const bcrypt = require("bcryptjs");
const User = require("../models/user");
const userValidation = require("../middleware/userValidation");

module.exports = function (app) {
  app.post("/api/users", userValidation, (req, res) => {
    const newUser = User(req.userObject);
    newUser.save((err, user) => {
      if (err) throw err;
      res.send({
        status: "success",
        data: null,
      });
    });
  });

  app.get("/user", (req, res) => {
    console.log(req.user);
    if (req.user) {
      res.send(req.user);
    } else {
      res.send({ loggedOut: true });
    }
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
          // console.log(req.user);
        });
      }
    })(req, res, next);
  });

  app.get("/logout", (req, res) => {
    req.logout();
    res.send({ loggedOut: true });
  });
};
