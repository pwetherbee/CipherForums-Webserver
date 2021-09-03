var express = require("express");
const idGen = require("../helpers/generateRandomID");
let SQLHelper = require("../helpers/sqlQueryHelper");
var router = express.Router();
var path = require("path");
router.use(express.json());

// Create new forum post using random ID
router.get("/demo", (req, res) => {
  let connection = SQLHelper.createConnection();
  let urlID = idGen.generateID();
  connection.connect();
  let query = `
      INSERT INTO Forums (url, subtitle, creationDate)
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

router.get("/forum", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/titled_forum/index.html"));
});

router.post("/forum", (req, res) => {
  const data = req.body;
  console.log(data);

  // TODO: Replace whitespace
  // TODO: Validate title
  const url = data.title + "#" + idGen.generateHexID();
  console.log(url);
  let connection = SQLHelper.createConnection();
  connection.connect();
  let query = `
      INSERT INTO Forums (url, subtitle, authorID, creationDate)
    VALUES ("${url}", "${data.subtitle}", "${req.session.userID}", NOW());
    `;
  connection.query(query, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    console.log("success");
  });
  connection.end();
  res.send(JSON.stringify({ url: url }));
  // res.send(JSON.stringify({ redirect: "ok" }));
});

router.get("/user", (req, res) => {
  if (!req.session.username) {
    // return res.send("user not logged in");
    return res.redirect("../");
  }
  let connection = SQLHelper.createConnection();
  let urlID = idGen.generateID();
  connection.connect();
  let query = `
    INSERT INTO Forums (url, subtitle, authorID, creationDate)
          VALUES ("${urlID}", "${urlID}", "${req.session.userID}", NOW());
    `;
  connection.query(query, function (err, rows, fields) {
    if (err) throw err;
    console.log("success");
  });
  connection.end();
  res.redirect(`https://cipherforums.com/threads/${urlID}`);
});

module.exports = router;
