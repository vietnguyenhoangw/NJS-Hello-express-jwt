var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express();

// view engine setup - envirroment setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// data
const post = [
  {
    username: "Daniel",
    isStudent: false,
  },
  {
    username: "Henry",
    isStudent: true,
  },
];

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to hello express jwt." });
});

app.get("/posts", (req, res) => {
  res.json(post);
});

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
  res.json({
    status: false,
    errors: {
      code: err.code,
      message: err.message,
    },
  });
});

module.exports = app;
