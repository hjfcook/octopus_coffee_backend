const User = require("../models/user");

module.exports = function isAdmin(req, res, next) {
  const user = req.user;
  if (user) {
    User.findOne({ email: user.email }, (err, doc) => {
      if (err) throw err;
      if (doc.admin) {
        next();
      } else {
        res.status(403).send({
          status: "fail",
          data: {
            user: "Current user does not have admin permissions",
          },
        });
      }
    });
  } else {
    res.status(401).send({
      status: "fail",
      data: {
        user: "No user is currently logged in",
      },
    });
  }
};
