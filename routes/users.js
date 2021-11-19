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

  app.get("/api/users/:id", isLoggedIn, isOwnUserOrAdmin, (req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) throw err;
      const userResponse = user;
      userResponse.password = undefined;
      res.send({
        status: "success",
        data: userResponse,
      });
    });
  });

  // app.put(
  //   "/api/users/:id",
  //   isLoggedIn,
  //   isOwnUserOrAdmin,
  //   userValidation,
  //   (req, res) => {
  //     const id = req.params.id;
  //     User.findByIdAndUpdate(
  //       id,
  //       req.coffeeObject,
  //       { new: true },
  //       (err, user) => {
  //         const userResponse = user;
  //         userResponse.password = undefined;
  //         if (err) throw err;
  //         res.send({
  //           status: "success",
  //           data: user,
  //           // ? does this really need to return the user?
  //         });
  //       }
  //     );
  //   }
  // );

  // app.delete("/api/users/:id", isLoggedIn, isOwnUserOrAdmin, (req, res) => {
  //   const id = req.params.id;
  //   User.findByIdAndDelete(id, (err, user) => {
  //     if (err) throw err;
  //     res.send({
  //       status: "success",
  //       data: null,
  //     });
  //   });
  // });
};
