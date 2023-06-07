require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const User = require("./mongoDB-config");

passport.use(
  new LocalStrategy(async function verify(username, password, done) {
    try {
      const user = await User.findOne({ username: username });
      if (user) {
        if (user.password === password) {
          return done(null, user, { message: "user found" });
        }
        return done(null, false, { message: "password dosent match" });
      } else {
        const user = await User.findOne({ email: username });
        if (user && user.password === password) {
          return done(null, user, { message: "user found" });
        }
        return done(null, false, { message: "user not found" });
      }
    } catch (err) {
      console.log(err.message);
      return done(err, false);
    }
  })
);

passport.serializeUser((user, done) => {
  return done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById({ _id: id });
    return done(null, user);
  } catch (err) {
    console.log(err.message);
    return done(err, false);
  }
});
