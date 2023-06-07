require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("./mongoDB-config");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
      state: true,
    },
    async function verify(refreshToken, accessToken, profile, done) {
      const date = new Date();
      try {
        const user = await User.findById({ _id: profile.id.toString() });
        if (user) {
          return done(null, user, { message: "user found" });
        } else {
          const newUser = new User({
            _id: profile.id.toString(),
            proPic: profile._json.picture,
            username: profile.displayName,
            email: profile._json.email,
            password: "",
            created_on: date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            }),
          });
          const user = await newUser.save();
          return done(null, user, { message: "user created" });
        }
      } catch (err) {
        console.log(err.message);
        return done(err, false);
      }
    }
  )
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
