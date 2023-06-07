require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const cors = require("cors");
const createUser = require("./createUser");

const app = express();

const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cors({
    origin: process.env.CLIENT_HOME,
    credentials: true,
  })
);

app.set("trust proxy", 1); // comment out while testing locally

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    cookie: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    }, // comment out while testing locally
  })
);
app.use(passport.initialize());
app.use(passport.session());
require("./passport-local-config");
require("./passport-google-config");

app.listen(process.env.PORT || port, () => {
  console.log(`Server running on port: ${port}`);
});

app.get("/", (req, res) => {
  res.redirect(process.env.CLIENT_HOME);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: process.env.CLIENT_HOME }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_HOME}/dashboard`);
  }
);

app.get("/authenticate", (req, res) => {
  console.log(req.user);
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.status(403).send("User not authenticated");
  }
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log("logout failed");
      res.send(false);
    } else {
      console.log("user logged out successfully");
      res.send(true);
    }
  });
});

app.get("/connectionStream", (req, res) => {
  res.status(200).send("Connection active");
});

app.post("/createUser", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await createUser(username, email, password);
    console.log(user);
    res.status(200).send("user created");
  } catch (err) {
    console.error(err);
    res.status(500).send("error creating user");
  }
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).send("Login successfull");
});
