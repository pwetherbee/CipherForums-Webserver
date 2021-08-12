var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var fileRouter = require("./routes/fileget");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var threadRouter = require("./routes/threads");
var helpRouter = require("./routes/help");
var apiRouter = require("./routes/api");

process.env.NODE_ENV = "production";

const Bundler = require("parcel-bundler");

var cors = require("cors");

var app = express();

/*
bundle multiple files
*/
const options = {};

let bundlers = [new Bundler("./devFiles/index.html", {})];

bundlers.forEach(async (bundler) => {
  await new Promise((resolve) => {
    bundler.on("bundled", resolve);
    bundler.bundle();
  });
});

// const file = "public/forum_post/index.html";
// const options = {
//   outDir: "./public/thread_files/",
//   publicUrl: "/public/thread_files/",
// };
// const bundler = new Bundler(file, options);
// app.use("/", bundler.middleware());
app.use(cors());
app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/user", usersRouter);
app.use("/help", helpRouter);
app.use("/threads", threadRouter);
// app.use("/public/thread_files", express.static("public/thread_files"));
app.use("/", express.static("dist"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
