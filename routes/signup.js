var express = require("express");
var router = express.Router();
var path = require("path");

router.get("/", (req, res) => {
  console.log("fetching file");
  res.sendFile(path.join(__dirname, "../dist/signup/index.html"));
});

router.post("/", (req, res) => {
  console.log(req.body);
  res.send("successfully created new account");
});

module.exports = router;
