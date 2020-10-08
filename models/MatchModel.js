const db = require("../database.js").con;
const { getDateTime } = require("../utils/index.js");
var Match = {};

Match.createMatch = (user_id, user_swiped_id, callback = (resp) => {}) => {
  db.query(
    `INSERT INTO matches(user_id, user_2_id, created_at) VALUES (${user_id}, ${user_swiped_id}, '${getDateTime()}');`,
    (err, result) => {
      if (err) {
        callback({ status: "error", error: err });
      } else {
        db.query(
          `SELECT * FROM users WHERE id = ${user_swiped_id}`,
          (err, result) => {
            callback({
              status: "success",
              data: { match: true, match_user: result[0] },
            });
          }
        );
      }
    }
  );
};

//Check if two users have liked eachother
Match.checkMatch = (swipe_id, callback = (resp) => {}) => {
  db.query(`SELECT * FROM swipes WHERE id = ${swipe_id}`, (err, result) => {
    db.query(
      `SELECT * FROM swipes WHERE user_id = ${result[0].user_swiped_id} AND user_swiped_id = ${result[0].user_id}`,
      (err, result) => {
        if (result[0]) {
          console.log(result);
          Match.createMatch(
            result[0].user_swiped_id,
            result[0].user_id,
            (resp) => {
              callback(resp);
            }
          );
        } else {
          callback({ status: "success", data: { match: false } });
        }
      }
    );
  });
};

Match.getMatches = (user_id, callback = () => {}) => {
  db.query(`SELECT * FROM swipes WHERE id = ${swipe_id}`, (err, result) => {
    db.query(
      `SELECT * FROM swipes WHERE user_id = ${result[0].user_swiped_id} AND user_swiped_id = ${result[0].user_id}`,
      (err, result) => {
        if (result) {
          callback({ status: "success" });
        }
        console.log(result);
        console.log(err);
        callback({ result });
      }
    );
  });
};

module.exports = Match;
