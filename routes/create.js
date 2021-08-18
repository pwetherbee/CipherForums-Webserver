var express = require("express");
const idGen = require("../helpers/generateRandomID");
let SQLHelper = require("../helpers/sqlQueryHelper");
var router = express.Router();

router.get("/", (req, res) => {
  let connection = SQLHelper.createConnection();
  let urlID = idGen.generateID();
  connection.connect();
  let query = `
    INSERT INTO Forums (url, title, creationDate)
    VALUES ("${urlID}", "${urlID}", NOW());
    `;
  connection.query(query, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    console.log("success");
  });
  connection.end();
  res.send(res.redirect(`https://cipherforums.com/threads/${urlID}`));
  // if name given, check if name is in data already
  // create template with either anon user or profile name and thread id
});
module.exports = router;
