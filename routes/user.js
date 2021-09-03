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

router.use("/:id/thread", threadRouter);

router.use("/:id/keychain", keyChainRouter);

router.use("/:id/following", followingRouter);

module.exports = router;
