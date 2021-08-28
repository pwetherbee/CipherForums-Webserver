var express = require("express");
var router = express.Router();
var path = require("path");
const { runInNewContext } = require("vm");
let SQLHelper = require("../helpers/sqlQueryHelper");
/* GET users listing. */
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/saved_posts/index.html"));
});

router.post("/", (req, res) => {
  const data = req.body;
  if (!req.session.username || req.session.username == data.username)
    return res.status(401);
  const connection = SQLHelper.createConnection();
  connection.connect();
  const query = `
  INSERT INTO Following (userID, followingID)
  VALUES (${req.session.userID}, ${data.followingID})
  `;
  connection.query(query, (err) => {
    if (err) throw err;
  });
  res.send(JSON.stringify({ response: "successfully followed this person" }));
  connection.end();
});

router.get("/list", (req, res) => {
  // Incoming request includes username pulled from url
  const data = req.body;
  if (!req.session.username || req.session.username != data.username) {
    res.status(401);
    // res.send("You must be logged in to view this");
    return;
  }
  // If request is valid, grab the users that person is following from SQL database
  const connection = SQLHelper.createConnection();
  const query = `
  SELECT Users.username FROM Following
  INNER JOIN Users
  ON Users.userID = Following.followingID
  WHERE Following.userID = ${req.session.userID}
  `;
  connection.connect();
  connection.query(query, (err, rows) => {
    if (err) throw err;
    console.log(rows[0]);
    res.send({ data: rows[0] });
  });
  //   res.send(`here is the users following list for user ${req.session.username}`);
});

module.exports = router;
