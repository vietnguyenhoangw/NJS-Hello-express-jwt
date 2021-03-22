// dafault router route
const homeIndex = (req, res) => {
    res.status(200).json({ message: "Welcome to hello express jwt.", error: false });
}

module.exports = { homeIndex }