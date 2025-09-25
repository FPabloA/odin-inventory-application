const express = require("express");
const path = require("node:path");
require("dotenv").config();

const indexRouter = require("./routes/index.js");

const hostname = 'localhost';
const port = process.env.PORT || 3000;

const assetsPath = path.join(__dirname, "public");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", indexRouter);

app.listen(port, (error) => {
    if (error){
        throw error;
    }
    console.log(`Server running at http://${hostname}:${port}/`)
})