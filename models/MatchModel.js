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
  db.query(
    `SELECT * FROM matches WHERE user_id = ${user_id} OR user_2_id = ${user_id};`,
    (err, result) => {
      let query = "SELECT * FROM users WHERE ";
      if (result.length === 0) {
        callback({ result: "success", data: "no matches" });
        return;
      }
      result.forEach((match) => {
        const match_user =
          match.user_id !== user_id ? match.user_id : match.user_2_id;
        query += `id = ${match_user} OR `;
      });

      query = query.slice(0, -4) + ";";

      db.query(query, (err, result) => {
        callback({ result: "success", data: result });
      });
    }
  );
};

module.exports = Match;
