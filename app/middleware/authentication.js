require("dotenv").config();
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (token == null) return res.sendStatus(401);
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err)
                return res.status(403).json({ message: "error auth token", error: true });
            req.user = user;
            next();
        });
    } catch {
        res.status(401).json({
            message: 'Invalid request!',
            error: true
        });
    }
};

// generate a token
function generateAccessToken(username) {
    // expires after half and hour (1800 seconds = 30 minutes)
    return jwt.sign(username, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30s",
    });
}

module.exports = { auth, generateAccessToken }