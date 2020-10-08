const bodyParser = require("body-parser");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const User = require("./models/UserModel");
const Swipe = require("./models/SwipeModel");
const app = express();
const passport = require("passport");
const BearerStrategy = require("passport-http-bearer");
const jwt = require("jwt-simple");
const Match = require("./models/MatchModel");
const port = process.env.PORT || 3000;
dotenv.config();

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

// User Endpoints
app.get("/user", passport.authenticate("bearer", { session: false }), function (
  req,
  res,
  next
) {
  res.json({ user: req.user });
});

app.post("/user/login", (req, res) => {
  User.login(req.body.email, req.body.password, (resp) => {
    if (resp.error) {
      res.json(resp);
      return;
    }

    const token = jwt.encode(req.body.email, process.env.JWT_SECRET);

    res.json({ status: "success", token });
  });
});

app.post("/user/register", (req, res) => {
  const { email, password, age, description, picture } = req.body;
  const user = { email, password, age, description, picture };
  console.log(user);
  User.createUser(user, (resp) => {
    res.json(resp);
  });
});

app.get(
  "/users/:take/:skip",
  passport.authenticate("bearer", { session: false }),
  function (req, res, next) {
    User.getPotentialMatches(
      req.user.id,
      req.params.take,
      req.params.skip,
      (resp) => res.json(resp)
    );
  }
);

// Swipe Endpoints
app.post(
  "/swipe",
  passport.authenticate("bearer", { session: false }),
  function (req, res, next) {
    //TODO: Verify that swipe doesn't already exist, in this case, update instead
    Swipe.createSwipe(req.user, req.body.swiped_id, req.body.action, (resp) => {
      if (req.body.action === "like") {
        Match.checkMatch(resp.swipe_id, (resp) => {
          res.json(resp);
        });
      } else {
        res.json(resp);
      }
    });
  }
);
// Swipe inner join

// Match Endpoints
app.get(
  "/matches",
  passport.authenticate("bearer", { session: false }),
  function (req, res, next) {
    const user = req.user;

    res.json({ status: "success", user });
    // Route implementation here...
  }
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
