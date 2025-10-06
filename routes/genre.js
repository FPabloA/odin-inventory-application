const express = require("express");
const router = express.Router();

const genreController = require("../controllers/genreController");

router.route("/").get(genreController.getAllGenres);

router.route("/new")
    .get(genreController.newGenreGet)
    .post(genreController.newGenrePost);



module.exports = router;