var express = require("express");
var router = express.Router();
var path = require("path");
const sessions = require("express-session");

router.get("/", (req, res) => {
  req.session.destroy(function (err) {
    if (err) throw err;
  });
  res.redirect("../login");
});

module.exports = router;
