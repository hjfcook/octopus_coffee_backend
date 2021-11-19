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
};
