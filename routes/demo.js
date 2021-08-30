var express = require("express");
var router = express.Router();
var path = require("path");

router.get("/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/forum_post/index.html"));
});

module.exports = router;
