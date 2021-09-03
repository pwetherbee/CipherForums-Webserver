var express = require("express");
var router = express.Router();
var path = require("path");
const bcrypt = require("bcryptjs");
let SQLHelper = require("../helpers/sqlQueryHelper");
const { body, validationResult } = require("express-validator");
router.use(express.json());

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/signup/index.html"));
});

router.post(
  "/",
  body("username").isAlphanumeric(),
  body("email").isEmail().normalizeEmail(),
  (req, res) => {
    //   get files from signup request
    let newAccount = req.body;
    // TODO: Account validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "invalid username",
      });
    }
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
    try {
      connection.query(query, function (err, rows, fields) {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            console.log("sending error response");
            res.send(
              JSON.stringify({
                response: "Username already exists",
                error: 1,
                redirect: ".",
              })
            );
            return;
          } else {
            throw err;
          }
        }
        // console.log("creating new account");
        res.send(
          JSON.stringify({
            response: "Account Successfully created",
            redirect: "..",
          })
        );
      });
      connection.end();
    } catch (err) {}
  }
);

module.exports = router;
