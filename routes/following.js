var express = require("express");
var router = express.Router();
var path = require("path");
const { runInNewContext } = require("vm");
let SQLHelper = require("../helpers/sqlQueryHelper");
router.use(express.json());
/* GET users listing. */
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/saved_posts/index.html"));
});

router.post("/", (req, res) => {
  const data = req.body;
  if (!req.session.username || req.session.username == data?.username)
    return res.status(401);
  const connection = SQLHelper.createConnection();
  connection.connect();
  //   const query = `
  //   WITH followID AS (SELECT userID FROM Users WHERE username = "${data.username}")
  //   INSERT INTO Following (userID, followingID)
  //   VALUES (${req.session.userID}, followID)
  //   `;
  const query = `
  INSERT INTO Following (userID, followingID)
  VALUES (${req.session.userID}, (SELECT userID FROM Users WHERE username = "${data.username}"))
  `;
  connection.query(query, (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return;
      } else {
        throw err;
      }
    }
  });
  res.send(JSON.stringify({ response: "successfully followed this person" }));
  connection.end();
});

router.get("/list/:name", (req, res) => {
  // Incoming request includes username pulled from url
  const username = req.params["name"];
  //   Use the following if you'd like to restrict users from seeing who you follow
  //   if (!req.session.username || req.session.username != username) {
  //     res.send("not allowed");
  //     // res.status(401);
  //     // res.send("You must be logged in to view this");
  //     return;
  //   }
  // If request is valid, grab the users that person is following from SQL database
  // TODO: Prevent duplicate entries to following

  const connection = SQLHelper.createConnection();
  const query = `
  SELECT Users.username FROM Following
  INNER JOIN Users
  ON Users.userID = Following.followingID
  WHERE Following.userID = (SELECT userID FROM Users WHERE username = "${username}")
  `;
  connection.connect();
  connection.query(query, (err, rows) => {
    if (err) throw err;
    res.send(JSON.stringify({ following: rows }));
  });
  //   res.send(`here is the users following list for user ${req.session.username}`);
});

module.exports = router;
