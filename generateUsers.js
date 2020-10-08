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
for (i = 0; i < loops; i++) {
  const name = faker.commerce.color();
  const age = faker.random.number(100);
  const email = faker.internet.email();
  const picture =
    images[faker.random.number({ min: 0, max: images.length - 1 })];
  const description = faker.commerce.productDescription();
  console.log(picture?.blue);
  bcrypt.hash("password", 10, function (err, hash) {
    try {
      db.query(
        `INSERT INTO users(name, age, email, password, picture, description) VALUES ('${name}', ${age}, '${email}', '${hash}', '${picture}', '${description}');`,
        (err, result) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              console.log("[-] Email taken".red);
              errors++;
            }
            console.log("[-] ".red + JSON.stringify(err).red);
            errors++;
          } else {
            console.log("[+] Created user: ".green + email.green);
          }
        }
      );
    } catch (error) {
      errors++;
      console.log("[-] ".red + error.red);
    }
  });
}
