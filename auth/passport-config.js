const User = require("../models/user");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      { usernameField: "email", passwordField: "password" },
      (username, password, done) => {
        User.findOne({ email: username }, (err, user) => {
          if (err) throw err;
          if (!user) return done(null, false);
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        });
      }
    )
  );

  //serialises user.id to cookie
  passport.serializeUser((user, callback) => {
    callback(null, user.id);
  });

  // deserialise by searching using id from cookie
  passport.deserializeUser((id, callback) => {
    User.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        admin: user.admin,
      };
      callback(err, userInformation);
    });
  });
};
