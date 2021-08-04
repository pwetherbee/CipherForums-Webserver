var express = require("express");
var keyChainRouter = require("./keyChain");
var router = express.Router();
var path = require("path");
/* GET users listing. */
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/following/index.html"));
});

router.use("/:id/keychain", keyChainRouter);

module.exports = router;
