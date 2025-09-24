const { Client } = require("pg");
require("dotenv").config();

const dropTables = `DROP TABLE IF EXISTS inventory, genres;`;

//maybechange the runtime type
const createSQLTable = `CREATE TABLE IF NOT EXISTS inventory ( id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name VARCHAR(50) UNIQUE, genre_id INTEGER, quantity INTEGER, price DECIMAL(5, 2), artist VARCHAR(50), src TEXT DEFAULT '/images/placeholder.jpg', description VARCHAR(250), isDefault BOOLEAN);`;

const createSQLData = `
INSERT INTO inventory (name, genre_id, quantity, price, artist, src, description, isdefault) VALUES
    ('The Bends', 2, 100, 23.30, 'Radiohead', '/images/thebends.jpg', 'Exploring themes of fame, identity, and existential anxiety through a blend of alternative rock and post-rock with more complex guitar textures and atmospheric elements', true),
    ('Off The Wall', 3, 45, 9.83, 'Michael Jackson', '/images/offthewall.jpg', 'This album ushered in an exciting new era of R&B-to-pop crossover airplay, chart, marketing and sales trends not seen before in modern pop music', true),
    ('Imaginal Disk', 4, 76, 15.77, 'Magdalena Bay', '/images/imaginaldisk.jpg', 'While they call California home, their essence lies in the clouds, emitting unique yet familiar frequencies of synthesized nostalgia, kitschy catchiness, and warped neo-hooks', true),
    ('Enter The Wu-Tang (36 Chambers)', 5, 22, 6.34, 'Wu-Tang Clan', '/images/enterthewu.jpg', 'A genre-defining masterpiece, Enter The Wu-Tang (36 Chambers) revolutionized hip-hop with its raw, gritty production and razor-sharp lyricism', true),
    ('All Things Must Pass', 2, 150,  26.99, 'George Harrison', '/images/allthingsmustpass.jpg', 'It is both an intensely personal statement and a grandiose gesture, a triumph over artistic modesty, even frustration. In this extravaganza of piety and sacrifice and joy the music itself is no longer the only message', true),
    ('Are You Experienced', 2, 13, 11.98, 'The Jimi Hendrix Experience', '/images/areyouexperienced.jpg', 'The album features Jimi Hendrix s innovative approach to songwriting and electric guitar playing which soon established a new direction in psychedelic and hard rock music', true);
`;

const createGenreTable = `CREATE TABLE IF NOT EXISTS genres (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, genre VARCHAR(50) UNIQUE, color TEXT UNIQUE);`;

const createGenres = `
INSERT INTO genres (genre, color) VALUES
    ('Uncategorized', '#fefefe'),
    ('Rock', '#FF0000'),
    ('Funk', '#0000FF'),
    ('Electronic', '#800080'),
    ('Hip Hop', '#00FF00')
`

async function main () {
    console.log("Seeding...");
    const client = new Client({
        host: 'localhost',
        user: process.env.USER,
        database: process.env.DB,
        password: process.env.PASS,
        port: process.env.DBPORT
    });
    try {
        await client.connect();
        console.log("Connected to database.");
        await client.query(dropTables);
        await client.query(createGenreTable);
        await client.query(createSQLTable);
        console.log('Tables created');
        await client.query(createGenres);
        await client.query(createSQLData);
        console.log("Data created");
    }
    catch (error){
        console.log("Error occured: ", error);
    }
    finally {
        await client.end();
        console.log("Done.");
    }
}

main();
