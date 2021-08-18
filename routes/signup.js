var express = require("express");
var router = express.Router();
var path = require("path");
const bcrypt = require("bcryptjs");
let SQLHelper = require("../helpers/sqlQueryHelper");
router.use(express.json());

router.get("/", (req, res) => {
  console.log("fetching file");
  res.sendFile(path.join(__dirname, "../dist/signup/index.html"));
});

router.post("/", (req, res) => {
  //   get files from signup request
  let newAccount = req.body;
  // TODO: Account validations

  // TODO: Password encryption
  let salt = bcrypt.genSaltSync(10);
  var passHash = bcrypt.hashSync(newAccount.password, salt);
  //   console.log("hash matches?", bcrypt.compareSync(newAccount.password, hash));
  // make sql query to add new user
  let connection = SQLHelper.createConnection();
  let query = `
  INSERT INTO Users (username, email, passwd, registrationDate)
  VALUES ("${newAccount.username}", "${newAccount.email}", "${passHash}", NOW())
  `;
  connection.connect();
  connection.query(query, function (err, rows, fields) {
    if (err) throw err;
  });
  connection.end();
  res.send(
    JSON.stringify({
      response: "Account Successfully created",
      redirect: "..",
    })
  );
});

module.exports = router;
