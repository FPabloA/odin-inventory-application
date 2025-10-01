const express = require("express");
const multer = require("multer");
const router = express.Router();

const stockController = require("../controllers/stockController");

const { upload } = require("../controllers/uploadController");

router.route("/").get(stockController.getAllProducts);

router.route("/new").get(stockController.addProduct)
.post(upload.single("src"), stockController.addProductToDb);

router.route("/:id").get(stockController.showProduct);

router.route("/edit/:id").get(stockController.editProductGet);

router.route("/delete/:id").post(stockController.deleteProduct);

module.exports = router;