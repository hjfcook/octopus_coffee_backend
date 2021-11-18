const passport = require("passport");

module.exports = function (app) {
  // app.get("/user", (req, res) => {
  app.get("/api/auth/currentuser", (req, res) => {
    console.log(req.user);
    if (req.user) {
      res.send(req.user);
    } else {
      res.send({ loggedOut: true });
    }
  });

  // app.post("/login", (req, res, next) => {
  app.post("/api/auth/login", (req, res, next) => {
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

  // app.get("/logout", (req, res) => {
  app.post("/api/auth/logout", (req, res) => {
    req.logout();
    res.send({ loggedOut: true });
  });
};
