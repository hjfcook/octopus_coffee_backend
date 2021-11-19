const User = require("../models/user");

module.exports = function isAdmin(req, res, next) {
  const user = req.user;
  User.findOne({ email: user.email }, (err, doc) => {
    if (err) throw err;
    if (doc.admin) {
      next();
    } else {
      res.status(403).send({
        status: "fail",
        data: {
          user: "The current user does not have permission to complete this action",
        },
      });
    }
  });
};
