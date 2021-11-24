module.exports = function isLoggedIn(req, res, next) {
  console.log(req.user);
  if (req.hasOwnProperty("user")) {
    next();
  } else {
    res.status(401).send({
      status: "fail",
      data: {
        user: "No user is currently logged in",
      },
    });
  }
};
