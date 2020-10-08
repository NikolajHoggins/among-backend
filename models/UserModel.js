const db = require("../database.js").con;
const bcrypt = require("bcrypt");
var SqlString = require("sqlstring");

var User = {};

User.createUser = (user, callback = (resp) => {}) => {
  const error = validate(user.email, user.password);
  if (error) callback({ status: "errorrr", error });

  bcrypt.hash(user.password, 10, function (err, hash) {
    db.query(
      `INSERT INTO users(email, password, age, description, picture) 
        VALUES ('${user.email}', '${hash}', ${user.age}, '${user.description}', '${user.picture}');`,
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
    callback(null, result[0]);
  });
};

User.getPotentialMatches = (
  user_id,
  take = 10,
  skip = 0,
  callback = () => {}
) => {
  //get users that hasn't already been liked
  db.query(
    //We need to check skip before we check swipe, otherwise users could
    `SELECT * FROM users WHERE id NOT IN (SELECT user_swiped_id FROM swipes WHERE user_id = ${user_id}) AND NOT id = ${user_id} ORDER BY id ASC LIMIT ${skip}, ${take};`,
    (err, result) => {
      if (err) {
        callback({ result: "error", error: err });
        return;
      }

      //success
      callback({ result: "success", data: result });
    }
  );
};

function validate(email, password) {
  if (!email) return "email is required";
  if (!password) return "password is required";

  if (password.length < 8) {
    return "password must be at least 8 characters";
  }
}

module.exports = User;
