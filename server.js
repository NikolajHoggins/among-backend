const bodyParser = require("body-parser");
const db = require("./database.js").con;
const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const cors = require("cors");
const User = require("./models/UserModel");
const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

// parse application/json
app.use(bodyParser.json());
app.use(cors());

//User stuff
app.post("/user/login", (req, res) => {
  User.login(req.body.email, req.body.password, (resp) => {
    res.json(resp);
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
