var express = require("express");
var router = express.Router();
var path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/login/index.html"));
});

router.post("/", (req, res) => {});

module.exports = router;
