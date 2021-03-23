require("dotenv").config();
const jwt = require("jsonwebtoken");
const fakeData = require("../data/fakedata")
const authentication = require("../middleware/authentication")

function login(req, res) {
    // authenticate user
    const username = req.body.username;
    const password = req.body.password;
    const exitUser = fakeData.users.filter((user) => {
        return user.username === username ? user : "";
    });
    if (exitUser.length > 0) {
        const exitUserPassword = JSON.parse(exitUser[0].password);
        const isCorrectPassword = exitUserPassword.toString() === password;
        if (isCorrectPassword) {
            const accessToken = authentication.generateAccessToken(exitUser[0])
            const refreshToken = jwt.sign(exitUser[0], process.env.REFRESH_TOKEN_SECRET)
            fakeData.refreshTokens.push(refreshToken)
            res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, error: false });
            res.end();
        } else {
            res.status(403).json({ message: "wrong password", error: true });
            res.end();
        }
    } else {
        res.status(404).json({ message: "user not found", error: true });
        res.end();
    }
};

function register(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const title = req.body.title;
    if (!username || !password || !title) {
        return res.status(411).json({ message: "paramester is invalid", error: true });
    } else {
        const isExitUser = fakeData.users.filter((user) => {
            if (user.username.toString() === username.toString()) {
                return true;
            }
        });
        if (isExitUser.length > 0) {
            res.status(404).json({ error: "user is already exits", error: true });
        } else {
            // authenticate user
            const user = {
                username,
                password,
                title,
            };
            const token = authentication.generateAccessToken(user);
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
            fakeData.users.push(user);
            fakeData.refreshTokens.push(refreshToken)
            res.status(200).json({ accessToken: token, refreshToken: refreshToken, error: false });
        }
    }
}

function token(req, res) {
    const refreshToken = req.body.refreshToken
    if (!refreshToken) return res.status(403).json({ message: "token param is invalid", error: true });
    if (!fakeData.refreshTokens.includes(refreshToken)) return res.status(403).json({ message: "refresh token param is invalid", error: true });
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "have an error when verify token", error: true });
        const tokenUser = {
            username: user.username,
            title: user.title,
            password: user.password
        }
        const accessToken = authentication.generateAccessToken(tokenUser)
        res.status(200).json({ accessToken: accessToken, error: false });
    })
}

module.exports = { login, register, token };