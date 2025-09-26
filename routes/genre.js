const express = require("express");
const router = express.Router();

const genreController = require("../controllers/stockController");

router.route("/").get((req, res) => {
    res.render("index", { title: "Genre Page"});
});

module.exports = router;