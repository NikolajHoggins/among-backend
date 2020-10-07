const db = require("../database.js").con;
const bcrypt = require("bcrypt");

var User = {};

User.createUser = (email, password, callback = (resp) => {}) => {
  const error = validate(email, password);
  if (error) callback({ status: "errorrr", error });

  bcrypt.hash(password, 10, function (err, hash) {
    db.query(
      `INSERT INTO users(email, password) VALUES ('${email}', '${hash}');`,
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            callback({ status: "error", error: "email taken" });
          }
          callback({ status: "error", error: err });
        } else {
          callback({ status: "success" });
        }
      }
    );
  });
};

User.login = (email, password, callback = () => {}) => {
  db.query(`SELECT * FROM users WHERE email = '${email}'`, (err, result) => {
    if (err) {
      callback({ status: "error", error: err });
      return;
    }

    if (result) {
      bcrypt.compare(password, result[0]?.password, (err, res) => {
        if (res) {
          callback({
            status: "success",
            user: result,
          });
        } else {
          callback({ status: "error", error: "invalid login" });
        }
      });
    }
  });
};

User.findOne = (email, callback = () => {}) => {
  db.query(`SELECT * FROM users WHERE email = '${email}'`, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }

    //success
    callback(null, result);
  });
};

function validate(email, password) {
  if (!email) return "email is required";
  if (!password) return "password is required";

  if (password.length < 8) {
    return "password must be at least 8 characters";
  }
}

module.exports = User;
