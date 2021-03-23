const fakeData = require("../../app/data/fakedata")

function getUser(req, res) {
    res.status(200).json(fakeData.users.filter((user) => user.username === req.user.username));
}

module.exports = { getUser }