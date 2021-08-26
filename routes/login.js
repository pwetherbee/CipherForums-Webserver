var express = require("express");
var router = express.Router();
var path = require("path");
const sessions = require("express-session");
const bcrypt = require("bcryptjs");
let SQLHelper = require("../helpers/sqlQueryHelper");
router.use(express.json());

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/login/index.html"));
});

router.post("/", (req, res) => {
  const account = req.body;
  // TODO: Validate input
  // Get password hash for corresponding username from database
  let connection = SQLHelper.createConnection();
  const query = `
  SELECT passwd FROM Users
  WHERE username = "${account.username}"
  LIMIT 1
  `;
  connection.connect();
  connection.query(query, function (err, rows, fields) {
    if (err) throw err;

    // console.log(rows[0]);
    if (!rows?.length) {
      res.send(
        JSON.stringify({ message: "Username is incorrect", valid: false })
      );
      return;
    }
    const hash = rows[0].passwd;
    const matches = bcrypt.compareSync(account.password, hash);
    if (matches) {
      // create new session
      req.session.username = account.username;
      res.send(
        JSON.stringify({
          message: "Correct password!",
          valid: true,
          redirect: "..",
          user: req.session.username,
          timeout: req.session.cookie.maxAge,
        })
      );
      return;
    } else {
      res.send(
        JSON.stringify({ message: "Password is incorrect", valid: false })
      );
      return;
    }
    // res.send(JSON.stringify({ response: "Error has occured" }));
    // console.log("error occured");
  });

  connection.end();
  // res.send(JSON.stringify({ response: "Username is incorrect" }));
});

module.exports = router;
