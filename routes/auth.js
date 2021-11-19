const passport = require("passport");

module.exports = function (app) {
  app.get("/api/auth/currentuser", (req, res) => {
    if (req.user) {
      res.send({
        status: "success",
        data: req.user,
      });
    } else {
      res.send({
        status: "fail",
        data: "No user is currently logged in",
      });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) {
        res.send({
          status: "fail",
          data: "No such user exists",
        });
      } else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.send({
            status: "success",
            data: null,
          });
        });
      }
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout();
    res.send({
      status: "success",
      data: null,
    });
  });
};
