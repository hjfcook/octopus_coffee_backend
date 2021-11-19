const isAdmin = require("./isAdmin");

module.exports = function isOwnUserOrAdmin(req, res, next) {
  const id = req.params.id;
  if (id === req.user._id.toString()) {
    next();
  } else {
    isAdmin(req, res, next);
  }
};
