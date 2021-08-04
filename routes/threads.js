var express = require("express");
var router = express.Router();
var path = require("path");
// const app = require("../app");
// const Bundler = require("parcel-bundler");
/* GET home page. */
// app.use(express.static("public"));
router.get("/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/forum_post/index.html"));
});
// const file = "public/forum_post/index.html";
// const options = {
//   outDir: "./public/thread_files/",
//   publicUrl: "/public/thread_files/",
// };
// const bundler = new Bundler(file, options);
// router.use("/", bundler.middleware());

// router.get("/", (req, res) => {
//   let id = req.params["id"];
//   res.send(testdata[id]);
// });

module.exports = router;
