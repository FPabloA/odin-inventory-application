db = require("../db/queries");

async function getAllGenres(req, res) {
    const getGenres = await db.getGenres();

    const listedGenres = getGenres.filter(
        (genre) => genre.genre !== "Uncategorized"
    );

    res.render("genres", {
        title:"TBA Genres",
        listedGenres,
    });
}

async function newGenreGet(req, res) {
    res.render("newGenre",  { title: "Add a Genre" });
}

async function newGenrePost(req, res) {
    const input = {
        genre: req.body.genre,
        color: req.body.color,
    };
    try {
        await db.addGenre(input);
        res.redirect("/genre");
    }
    catch (err) {
        res.status(500).send("Error adding genre to database")
    }
}

async function deleteGenreGet(req, res) {
    const getGenres = await db.getGenres();

    const listedGenres = getGenres.filter(
        (genre) => genre.genre !== "Uncategorized"
    );
    res.render("deleteGenre", {
        title: "Delete a genre",
        listedGenres: listedGenres,
    })
}

async function deleteGenrePost(req, res) {
    const genre = req.body.genre;
    try {
        await db.deleteGenre(genre);
        res.redirect("/genre")
    }
    catch (err) {
        res.status(500).send("Error deleting genre", err);
    }
}

module.exports = {
    getAllGenres,
    newGenreGet,
    newGenrePost,
    deleteGenreGet,
    deleteGenrePost,
}