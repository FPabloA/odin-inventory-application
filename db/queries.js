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

async function filterById(id) {
    const { rows } = await pool.query(
        "SELECT inventory.*, genres.genre, genres.color FROM inventory JOIN genres ON inventory.genre_id = genres.id WHERE inventory.id = $1", [id]
    );

    return rows[0];
}

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
    filterById,
};