const pool = require("./pool");

const getAllProducts = async (query = null) => {
    try {

        if (query) {
            return filterStock(query);
        }

        const { rows } = await pool.query(
            "SELECT inventory.*, genres.genre, genres.color FROM inventory JOIN genres ON genre_id = genres.id;"
        );
        return rows;
    }
    catch (error) {
        console.error(error);
    }
};

const filterStock = async (query) => {
    let sortSQLQuery = "";
    if (query.sort) {
        const [column, direction] = query.sort
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .toLowerCase()
            .split(" ");
        
        if (!["price", "name"].includes(column) || !["asc", "desc"].includes(direction)) {
            sortSQLQuery = "";
        }
        else {
            sortSQLQuery = `ORDER BY ${column} ${direction}`;
        }
    }

    let genreSQLQuery = "";
    if (query.genre && query.genre.length > 0) {
        if(Array.isArray(query.genre)) {
            const genre = `${query.genre
                .map((gen) => `'${gen}'`)
                .join(", ")})`
            genreSQLQuery = `WHERE genres.genre IN ${genre}`;
        }
        else {
            genreSQLQuery = `WHERE genres.genre IN ('${query.genre}')`;
        }
    }

    const { rows } = await pool.query(
        `SELECT inventory.*, genres.genre, genres.color FROM inventory JOIN genres ON genre_id = genres.id ${genreSQLQuery} ${sortSQLQuery};`
    );

    return rows
}

async function filterById(id) {
    const { rows } = await pool.query(
        "SELECT inventory.*, genres.genre, genres.color FROM inventory JOIN genres ON inventory.genre_id = genres.id WHERE inventory.id = $1", [id]
    );

    return rows[0];
}

async function addProductToDb(newProduct) {
    const genreId = await getGenreIdByName(newProduct.genre);
    if(!genreId) {
        throw new Error("Invalid Category");
    }

    await pool.query(
        "INSERT INTO inventory ( name, quantity, price, artist, description, genre_id, src, isDefault) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [
            newProduct.name,
            newProduct.quantity,
            newProduct.price,
            newProduct.artist,
            newProduct.description,
            genreId,
            newProduct.src,
            false,
        ]
    );
}

async function deleteProduct(id) {
    await pool.query(
        "DELETE FROM inventory WHERE id = $1 AND isDefault = false",
        [id]
    );
}

async function editProduct({id, name, quantity, price, genre, artist, src, description}) {
    const updates = [];
    const values = [];
    let index = 1;

    if (name) {
        updates.push(`name =$${index++}`);
        values.push(name);
    }

    if (quantity) {
        updates.push(`quantity = $${index++}`);
        values.push(quantity);
    }

    if (price) {
        updates.push(`price = $${index++}`);
        values.push(price);
    }

    if (genre) {
        const genreId = await getGenreIdByName(genre);
        if (genreId) {
            updates.push(`genre_id = $${index++}`);
            values.push(genreId);
        }
        else{
            throw new Error("Invalid category");
        }
    }

    if (artist) {
        updates.push(`artist = $${index++}`);
        values.push(artist);
    }

    if (src) {
        updates.push(`src = $${index++}`);
        values.push(src);
    }

    if (description) {
        updates.push(`description = $${index++}`);
        values.push(description);
    }

    if (updates.length > 0) {
        const query = `UPDATE inventory SET ${updates.join(
            ", "
        )} WHERE id =$${index}`;
        values.push(id);
        await pool.query(query, values);
    }
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

async function addGenre(newGenre) {
    await pool.query(
        "INSERT INTO genres (genre, color) VALUES ($1, $2);",
        [newGenre.genre, newGenre.color]
    );
}

module.exports = {
    getAllProducts,
    getGenres,
    getGenreIdByName,
    filterById,
    addProductToDb,
    deleteProduct,
    editProduct,
    addGenre,
};