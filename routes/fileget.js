var express = require("express");
var router = express.Router();

router.use("/thread_files", express.static(__dirname + "/public/thread_files"));

router.use("/help_page", express.static(__dirname + "../public/help_page"));

module.exports = router;
