const { Client } = require("pg");
require("dotenv").config();


const client = new Client({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect((err) => {
    if(err) {
        console.error(err)
    } else {
        console.log("Ansluten")
        createTable();
    }
});

async function createTable() {
    try {
        const response = await client.query(`
            CREATE TABLE IF NOT EXISTS courses (
                id SERIAL PRIMARY KEY,
                courseCode varchar(6) NOT NULL UNIQUE,
                courseName varchar(50) NOT NULL,
                courseSyllabus varchar(255) NOT NULL,
                courseProgression char(1) NOT NULL,
                courseStatus char(10) NOT NULL
                );
        `)
        console.log(response)
    } catch (err) {
        console.log(err);
    } finally {
        await client.end()
    }
}

