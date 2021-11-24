const User = require("../models/user");
const userValidation = require("../middleware/userValidation");
const isAdmin = require("../middleware/isAdmin");
const isLoggedIn = require("../middleware/isLoggedIn");
const isOwnUserOrAdmin = require("../middleware/isOwnUserOrAdmin");

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

  app.get("/api/users", isLoggedIn, isAdmin, (req, res) => {
    // app.get("/api/users", (req, res) => {
    User.find({}, (err, users) => {
      if (err) throw err;
      res.send({
        status: "success",
        data: users.map((user) => {
          user.password = undefined;
          return user;
        }),
      });
    });
  });

  app.get("/api/users/:id", isLoggedIn, isOwnUserOrAdmin, (req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) throw err;
      user.password = undefined;
      res.send({
        status: "success",
        data: user,
      });
    });
  });

  app.put(
    "/api/users/:id",
    isLoggedIn,
    isOwnUserOrAdmin,
    userValidation,
    (req, res) => {
      const id = req.params.id;
      User.findByIdAndUpdate(id, req.userObject, { new: true }, (err, user) => {
        if (err) throw err;
        user.password = undefined;
        res.send({
          status: "success",
          data: user,
          // ? does this really need to return the user?
        });
      });
    }
  );

  app.delete("/api/users/:id", isLoggedIn, isOwnUserOrAdmin, (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id, (err, user) => {
      if (err) throw err;
      res.send({
        status: "success",
        data: null,
      });
    });
  });
};
