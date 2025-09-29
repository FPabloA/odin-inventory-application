const pool = require("./pool");

const getAllProducts = async (query = null) => {
    try {
        const { rows } = await pool.query(
            "SELECT inventory.*, genres.genre, genres.color FROM inventory JOIN genres ON genre_id = genres.id;"
        );
        return rows;
    }
    catch (error) {
        console.error(error);
    }
};

async function getGenres() {
    const { rows } = await pool.query(
        "SELECT * FROM genres ORDER BY genre ASC;"
    );
    
    return rows;
}

async function getGenreIdByName(genreName) {
    const { rows } = await pool.query(
        `SELECT id FROM genres WHERE genre = $1`, [genreName]
    );
    return rows[0].id;
}

module.exports = {
    getAllProducts,
    getGenres,
    getGenreIdByName,
};