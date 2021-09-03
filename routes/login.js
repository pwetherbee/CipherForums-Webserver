var express = require("express");
var router = express.Router();
var path = require("path");
const { body, validationResult } = require("express-validator");
const sessions = require("express-session");
const bcrypt = require("bcryptjs");
let SQLHelper = require("../helpers/sqlQueryHelper");
// var cors = require("cors");
router.use(express.json());

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/login/index.html"));
});

router.post("/", body("username").isAlphanumeric(), (req, res) => {
  // TODO: Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "invalid username",
    });
  }
  // Get password hash for corresponding username from database
  const account = req.body;
  let connection = SQLHelper.createConnection();
  const query = `
  SELECT passwd, userID FROM Users
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
    const id = rows[0].userID;
    const matches = bcrypt.compareSync(account.password, hash);
    if (matches) {
      // create new session
      req.session.username = account.username;
      req.session.userID = id;
      // console.log("logging in as ", req.session.username);
      res.send(
        JSON.stringify({
          message: "Correct password!",
          valid: true,
          redirect: `../user/${req.session.username}`,
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

router.get("/status", function (req, res) {
  // res.send(req.session);
  // return;
  // res.send("hello");
  // return;
  if (req.session.username) {
    // res.send(req.session.username);
    // res.status(400);
    res.send(JSON.stringify({ ok: 1 }));
  } else {
    // res.send("error");
    // res.status(200);
    res.send(JSON.stringify({ ok: 0 }));
  }
});
// const getUserID = function (username) {
//   let connection = SQLHelper.createConnection();
//   connection.connect();
//   var query = `
//   SELECT userID FROM Users
//   WHERE username = "${username}"
//   LIMIT 1
//   `;
//   var result;
//   return new Promise((resolve, reject) => {
//     connection.query(query, (err, rows) => {
//       if (err) {
//         throw err;
//       }
//       // console.log(rows);
//       resolve(rows[0].userID);
//     });
//   });

//   connection.end();
//   console.log(result);
//   return result;
// };

module.exports = router;
