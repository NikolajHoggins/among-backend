const db = require("../database.js").con;
const { getDateTime } = require("../utils/index.js");
var Swipe = {};

Swipe.createSwipe = (user, swiped_user, action, callback = (resp) => {}) => {
  db.query(`SELECT * FROM users WHERE id = ${swiped_user}`, (err, result) => {
    if (result) {
      db.query(
        `INSERT INTO swipes(user_id, user_swiped_id, action, created_at) VALUES (${
          user.id
        }, ${swiped_user}, '${action}', '${getDateTime()}');`,
        (err, result) => {
          if (err) {
            callback({ status: "error", error: err });
          } else {
            callback({ status: "success", swipe_id: result.insertId });
          }
        }
      );
    }
  });
};

module.exports = Swipe;
