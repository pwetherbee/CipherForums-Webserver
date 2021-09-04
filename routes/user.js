var express = require("express");
var keyChainRouter = require("./keyChain");
var followingRouter = require("./following");
const threadRouter = require("./threads");
var router = express.Router();
var path = require("path");
let SQLHelper = require("../helpers/sqlQueryHelper");
/* GET users listing. */
router.get("/:username", (req, res) => {
  // TODO: Make sure profile is in database
  const username = req.params["username"];
  const connection = SQLHelper.createConnection();
  connection.connect();
  let query = `SELECT userID FROM Users WHERE username = "${username}"`;
  connection.query(query, (err, rows) => {
    if (err) throw err;
    if (!rows[0]) {
      res.send("404: Account does not exist");
      // res.status(404);
      // console.log("no user found with name ", username);
    } else {
      res.sendFile(path.join(__dirname, "../dist/profile/index.html"));
    }
  });
  connection.end();
});

router.get("/:username/info", (req, res) => {
  const username = req.params["username"];
  let info = {
    username: username,
    bio: "",
    createdPosts: [],
    currUser: req.session?.username == username,
    isFollowing: true,
    loggedIn: Boolean(req.session?.userID),
  };
  // Get bio, created posts, and following list from database
  const connection = SQLHelper.createConnection();
  const query = `
  SELECT Forums.url, Forums.subtitle, Forums.creationDate, Users.username FROM Forums
  INNER JOIN Users
  ON Forums.authorID = Users.userID
  WHERE Users.username = "${username}"
  ORDER BY Forums.creationDate ASC
  `;
  connection.query(query, (err, rows) => {
    if (err) throw err;
    rows.forEach((row) => info.createdPosts.push(row));
    if (info.currUser) {
      res.send(JSON.stringify(info));
      return;
    }
    const query2 = `
    SELECT Count(Following.userID) FROM Following
    INNER JOIN Users
    ON Following.followingID = Users.userID
    WHERE Users.username = "${username}" AND Following.userID = ${
      req.session?.userID ? req.session.userID : null
    }
    `;
    connection.query(query2, (err, rows) => {
      if (err) throw err;
      // console.log(rows[0]["Count(Following.userID)"]);
      info.isFollowing = rows[0]["Count(Following.userID)"];
      res.send(JSON.stringify(info));
    });
  });
});

router.use("/:id/thread", threadRouter);

router.use("/:id/keychain", keyChainRouter);

router.use("/:id/following", followingRouter);

module.exports = router;
