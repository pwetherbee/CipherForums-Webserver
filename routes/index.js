var express = require("express");
var router = express.Router();
var path = require("path");
/* GET users listing. */
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

module.exports = router;
