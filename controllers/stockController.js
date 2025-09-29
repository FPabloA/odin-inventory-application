const db = require("../db/queries");

const getAllProducts = async (req, res) => {
    const genres = await db.getGenres();

    const checkQuery = JSON.stringify(req.query) === "{}";

    if (!checkQuery) {
        const products = await db.getAllProducts(req.query);

        res.render("stock", {
            title: "TBA Stock",
            products: products,
        });

        return;
    }

    const products = await db.getAllProducts();

    res.render("stock", {
            title: "TBA Stock",
            products: products,
        });
}

module.exports = {
    getAllProducts,
};