var faker = require("faker");
const db = require("./database.js").con;
const bcrypt = require("bcrypt");
var colors = require("colors");
const images = [
  "https://vignette.wikia.nocookie.net/among-us-wiki/images/5/55/7_black.png/revision/latest/top-crop/width/360/height/450?cb=20200912125223",
  "https://discourse.disneyheroesgame.com/uploads/default/original/3X/c/2/c23f54aea2065f106e4dbb8218d0ce2d7853351c.png",
  "https://vignette.wikia.nocookie.net/among-us-wiki/images/f/f1/5_orange.png/revision/latest/top-crop/width/360/height/450?cb=20200912125212",
  "https://vignette.wikia.nocookie.net/among-us-wiki/images/a/ab/Cyan.png/revision/latest/scale-to-width-down/340?cb=20200927084517",
  "https://i.redd.it/qu32y7c9uqk51.png",
  "https://i.redd.it/1bxfa07rf4951.png",
  "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/clans/33836086/edaa250a1692c7e6f80d4b18d695cc025736e716.gif",
];

const loops = 50;
let errors = 0;
db.query(`SELECT * FROM users WHERE NOT id = 1;`, (err, result) => {
  let query = `INSERT INTO swipes(user_id, user_swiped_id, action) VALUES `;

  result.forEach((user) => {
    if (faker.random.number({ min: 0, max: 5 }) === 3) {
      query += `(${user.id}, 1, 'like'),`;
    }
  });

  query = query.slice(0, -1) + ";";
  console.log(query);
  db.query(query, (err, resp) => {
    console.log(resp);
    console.log(err);
  });
});
