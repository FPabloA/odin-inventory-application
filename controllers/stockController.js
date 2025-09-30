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

async function showProduct(req, res) {
    const id = req.params.id;
    const products = await db.filterById(id);

    res.render("singleProduct", { product: products});
}

async function addProduct(req, res) {
    const listedGenres = await db.getGenres();

    res.render("newProduct", { listedGenres });
}

module.exports = {
    getAllProducts,
    showProduct,
    addProduct,
};