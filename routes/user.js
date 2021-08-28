var express = require("express");
var keyChainRouter = require("./keyChain");
var followingRouter = require("./following");
var router = express.Router();
var path = require("path");
/* GET users listing. */
router.get("/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/profile/index.html"));
});

router.use("/:id/keychain", keyChainRouter);

router.use("/:id/following", followingRouter);

module.exports = router;
