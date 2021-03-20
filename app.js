require("dotenv").config();

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

const jwt = require("jsonwebtoken");
app.use(express.json());

// data
const users = [
  {
    username: "Daniel",
    title: "Daniel and friends",
    password: "123123"
  },
  {
    username: "Henry",
    title: "Henry and his girl friend",
    password: "123123"
  },
];

// simple route
app.get("/", authenticateToken, (req, res) => {
  res.json({ message: "Welcome to hello express jwt." });
});

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.post("/login", (req, res) => {
  // authenticate user
  const username = req.body.username;
  const password = req.body.password;
  const exitUser = users.filter((user) => {
    return user.username === username ? user : ""
  })
  if (exitUser) {
    const isCorrectPassword = exitUser.password === password
    if (isCorrectPassword) {
      const accessToken = jwt.sign(exitUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
      res.status(200)
      res.statusCode(200)
      res.json({ accessToken: accessToken });
    } else {
      res.status(403)
      res.sendStatus(403)
      res.json({ "error": "wrong password" });
    }
  } else {
    res.status(404)
    res.statusCode(404)
    res.json({ "error": "user not found " })
  }
});

app.post("/register", (req, res) => {
  const username = req.body?.username
  const password = req.body?.password
  const title = req.body?.title
  if (!user) {
    return res.statusCode(411)
  } else {
    const isExitUser = users.filter((user) => {
      if (user.username === username) {
        return true
      }
    })
    if (isExitUser) {
      res.status(404).statusCode(404).json({ "error": "user is already exits" })
    } else {
      // authenticate user
      const user = {
        "username": username,
        "password": password,
        "title": title
      }
      const token = generateAccessToken(user);
      res.status(200).statusCode(200).json({ accessToken: token });
    }
  }
});

function generateAccessToken(username) {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign(username, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}

// authenticate middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).sendStatus(403).json({ "error": "error token" });
    req.user = user
    next();
  });
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
