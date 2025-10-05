const db = require("../db/queries");

const getAllProducts = async (req, res) => {
    const genres = await db.getGenres();

    const checkQuery = JSON.stringify(req.query) === "{}";

    if (!checkQuery) {
        const products = await db.getAllProducts(req.query);

        res.render("stock", {
            title: "TBA Stock",
            products: products,
            listedGenres: genres,
            selectedGenre: req.query.genre,
            sort: req.query.sort,
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

async function addProductToDb(req, res) {
    const newProduct = {
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        artist: req.body.artist,
        description: req.body.description,
        genre: req.body.genre,
        src: req.file ? `/uploads/${req.file.filename}` : "/images/placeholder.jpg",
        isDefault: false,
    };

    try {
        await db.addProductToDb(newProduct);
        res.redirect("/stock");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error adding product to database");
    }
}

async function deleteProduct(req, res) {
    const id = req.params.id;
    await db.deleteProduct(id);
    res.redirect("/stock");
}

async function editProductGet(req, res) {
    const id = req.params.id;
    const products = await db.filterById(id);
    const listedGenres = await db.getGenres();
    const selectedGenre = products.genre;

    res.render("editProduct", {
        product: products,
        listedGenres,
        selectedGenre,
    });
}

async function editProductPost(req, res) {
    const id = req.params.id;
    let src;

    const { name, quantity, price, genre, artist, description } = req.body;

    if(req.file) {
        src = `/uploads/${req.file.filename}`;
    }

    await db.editProduct({
        id,
        name,
        quantity,
        price,
        genre,
        artist,
        src,
        description,
    });

    res.redirect(`/stock/${id}`);
}

module.exports = {
    getAllProducts,
    showProduct,
    addProduct,
    addProductToDb,
    deleteProduct,
    editProductGet,
    editProductPost,
};