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

module.exports = {
    getAllGenres,
}