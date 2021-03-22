const users = require("../../app/data/fakedata")

function getUser(req, res) {
    res.status(200).json(users.filter((user) => user.username === req.user.username));
}

module.exports = { getUser }