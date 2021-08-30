const createError = require("http-errors");
const express = require("express");
const path = require("path");
const pug = require("pug");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");
const fileRouter = require("./routes/fileget");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const threadRouter = require("./routes/threads");
const helpRouter = require("./routes/help");
const apiRouter = require("./routes/api");
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const createRouter = require("./routes/create");
const demoRouter = require("./routes/demo");

// Define node.js env, defaults to development
// process.env.NODE_ENV = "production"; // production or development

var cors = require("cors");

var app = express();

/*
bundle multiple files
*/
// Make true when deploying
// const onEB = false;
if (process.env.BUNDLE) {
  const Bundler = require("parcel-bundler");

  const options = {};

  let bundlers = [
    new Bundler("./devFiles/index.html", {}),
    // new Bundler("./views/index.pug"),
  ];

  bundlers.forEach(async (bundler) => {
    await new Promise((resolve) => {
      bundler.on("bundled", resolve);
      bundler.bundle();
    });
  });
}

// Cors is used to accept requests from outside of the webserver
app.use(cors());

// Define sessions middleware
let sess = session({
  resave: true,
  saveUninitialized: true,
  secret: "secret",
  cookie: { maxAge: 60 * 60 * 1000, secure: app.get("env") === "production" },
});
if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  // sess.cookie.secure = true; // serve secure cookies
}
app.use(sess);
// Define routers
// app.use("/", (req, res) => {
//   res.render("index", { url: "sjdfksajdkf", action: "login" });
// });
app.use("/", indexRouter);
// app.use(express.static(path.join(__dirname, "public")));
app.use("/api", apiRouter);
app.use("/user", userRouter);
app.use("/help", helpRouter);
app.use("/threads", threadRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/create", createRouter);
app.use("/demo", demoRouter);

app.get("/test", function (req, res, next) {
  if (req.session.views) {
    req.session.views++;
    res.setHeader("Content-Type", "text/html");
    res.write("<p>views: " + req.session.views + "</p>");
    res.write("<p>expires in: " + req.session.cookie.maxAge / 1000 + "s</p>");
    res.write(
      "<p>your session is: " + req.session.cookie.maxAge / 1000 + "s</p>"
    );

    res.end();
  } else {
    req.session.views = 1;
    res.end("Welcome to the demo stream, refresh!");
  }
});
app.get("/logintest", function (req, res, next) {
  if (req.session.username) {
    res.setHeader("Content-Type", "text/html");
    res.write(
      "<p>session is logged in for user: " + req.session.username + "</p>"
    );
    res.write("<p>expires in: " + req.session.cookie.maxAge / 1000 + "s</p>");
    res.end();
  } else {
    res.end("User is not logged in!");
  }
});
// Serve homepage
app.use("/", express.static("dist"));
// app.use("/", express.static("public"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// JSON, urlencoded and cookie parser middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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
