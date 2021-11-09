const User = require('../models/user');

module.exports = function isAdmin(req, res, next) {
  const user = req.user;
  if (user) {
    User.findOne({email: user.email}, (err, doc) => {
      if (err) throw err;
      if (doc.admin) {
        next();
      }
      else {
        res.send({rejection: 'Only admins can perform this action'});
      }
    });
  } else {
    res.send({rejection: 'No user is currently logged in'});
  }
};