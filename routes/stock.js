const express = require("express");
const router = express.Router();

const stockController = require("../controllers/stockController");

router.route("/").get((req, res) => {
    res.render("index", { title: "Stock Page"});
});

module.exports = router;