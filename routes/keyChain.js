var express = require("express");
var router = express.Router();
var path = require("path");
/* GET users listing. */
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/keychain/index.html"));
});

module.exports = router;
