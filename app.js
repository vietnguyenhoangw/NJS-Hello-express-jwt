require("dotenv").config()

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

const jwt = require("jsonwebtoken")
app.use(express.json())

// data
const posts = [
  {
    username: "Daniel",
    title: "Daniel and friends",
  },
  {
    username: "Henry",
    title: "Henry and his girl friend",
  },
];

// simple route
app.get("/", authenticateToken, (req, res) => {
  res.json({ message: "Welcome to hello express jwt." });
});

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name))
})

app.post("/login", (req, res) => {
  // authenticate user
  const username = req.body.username
  const user = { name: username }
  console.log("user ", user);

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  res.json({ accessToken: accessToken })
});

// authenticate middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    res.user = user
    next()
  })
}

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
