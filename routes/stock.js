const express = require("express");
const router = express.Router();

const stockController = require("../controllers/stockController");

router.route("/").get(stockController.getAllProducts);

router.route("/new").get((req, res) => {
    res.render("index", { title: "Add Stock"});
});

module.exports = router;