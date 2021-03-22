// dafault router route
const home = (req, res) => {
    res.status(200).json({ message: "Welcome to hello express jwt.", error: false });
}

module.exports = { home }