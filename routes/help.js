var express = require("express");
var router = express.Router();
var path = require("path");
/* GET home page. */
// app.use(express.static("public"));

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/help_page/index.html"));
});
// router.get("/", (req, res) => {
//   let id = req.params["id"];
//   res.send(testdata[id]);
// });

module.exports = router;
