var express = require("express");
var router = express.Router();
var path = require("path");
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
  // make sql query to add new user
  let connection = SQLHelper.createConnection();
  let query = `
  INSERT INTO Users (username, email, passwd, registrationDate)
  VALUES ("${newAccount.username}", "${newAccount.email}", "${newAccount.password}", NOW())
  `;
  connection.connect();
  connection.query(query, function (err, rows, fields) {
    if (err) throw err;
  });
  connection.end();
  res.send(
    JSON.stringify({
      response: "Account Successfully created",
      redirect: "https:/cipherforums.com/login",
    })
  );
});

module.exports = router;
