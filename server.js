const bodyParser = require("body-parser");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const User = require("./models/UserModel");
const app = express();
const passport = require("passport");
const BearerStrategy = require("passport-http-bearer");
const jwt = require("jwt-simple");
dotenv.config();
const port = process.env.PORT || 3000;

// parse application/json
app.use(bodyParser.json());
app.use(cors());

passport.use(
  new BearerStrategy(function (token, done) {
    try {
      //Decode auth token to get user email
      var decoded = jwt.decode(token, process.env.JWT_SECRET);

      // TODO: Maybe check if token has expired

      // Find the user
      User.findOne(decoded, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false); //no user
        } else {
          return done(null, user); //allows the call chain to continue to the intented route
        }
      });
    } catch (err) {
      return done(null, false); //returns a 401 to the caller
    }
  })
);

//User stuff
app.post("/user/login", (req, res) => {
  User.login(req.body.email, req.body.password, (resp) => {
    if (resp.error) res.json(resp);

    const token = jwt.encode(req.body.email, process.env.JWT_SECRET);

    res.json({ status: "success", token });
  });
});

app.post("/user/register", (req, res) => {
  User.createUser(req.body.email, req.body.password, (resp) => {
    res.json(resp);
  });
});

app.get("/", (req, res) => {
  return res.status(200).json({ msg: "Successfull request to backend" });
});

app.get(
  "/secure",
  passport.authenticate("bearer", { session: false }),
  function (req, res, next) {
    // Get the authenticated user.
    var user = req.user;
    res.json({ status: "success", user });
    // Route implementation here...
  }
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

//Middleware to check api key
app.use(function (req, res, next) {
  //   if (!req.headers.authorization) {
  //     return res.status(403).json({ error: "No credentials sent!" });
  //   }
  //   if (req.headers.authorization !== process.env.API_KEY) {
  //     return res.status(403).json({ error: "Invalid credentials" });
  //   }
  next();
});
