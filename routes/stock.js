const express = require("express");
const router = express.Router();

const stockController = require("../controllers/stockController");

router.route("/").get(stockController.getAllProducts);

router.route("/new").get(stockController.addProduct);

router.route("/:id").get(stockController.showProduct);

module.exports = router;