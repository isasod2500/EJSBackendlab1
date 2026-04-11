const express = require("express")
require("dotenv").config();
const bodyParser = require("body-parser")
const { Client } = require("pg")
const app = express();
const port = 3000;
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())

//Anslut till klient
const client = new Client({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false,
    },
});

//I fall fel finns, printa felet.
client.connect((err) => {
    if (err) {
        console.log("DB error:", err);
    } else {
        console.log("Databasen ansluten");
    }
});

app.get("/", async (req, res) => {
    try {
        const result = await client.query(`SELECT * FROM courses`);
        res.render("index", { courses: result.rows })
    } catch (err) {
        console.log(err)
    }
});

app.get("/addcourse", (req, res) => {

    res.render("addcourse", {
        errors: [],
        cCode: "",
        cName: "",
        cPlan: "",
    });

});


app.post("/addcourse", async (req, res) => {
    const errors = [];
    errors.length = 0;
    //Hämtar värdet från formulär. Trimmar i fall whitespaces finns omkring
    let cCode = req.body.cCode.trim().toUpperCase();
    let cName = req.body.cName.trim();
    let cPlan = req.body.cPlan.trim().toUpperCase();
    let cProg = req.body.cProg.trim();
    let cStatus = req.body.cStatus.trim();

    try {
        //If-satser för att validera innehåll innan det skickas som query.
        if (cCode == "") {
            errors.push(`Du måste fylla i kurskod.`)
        }

        if (cName == "") {
            errors.push(`Du måste fylla i kursnamn.`)
        }

        if (cPlan == "") {
            errors.push(`Du måste ange fullständig länk för kursplanen.`)
        }

        //Lätt validerare för länk. I fall kurskoden inte finns i kursplanlänken nekas fältet.
        if (!cPlan.includes(cCode)) {
            errors.push(`Felaktig länk till kurs`)
        }

        //En validerare för unika entries för kurskoden.
        let result = await client.query(`SELECT * FROM courses WHERE coursecode LIKE $1`, [cCode]);
        if (result.rows.length > 0) {
            errors.push(`Kurskoden du angett har redan lagts till - ange ett unikt`)
        }

        if (errors.length > 0) {
            res.render("addcourse", {
                errors: errors,
                cCode: cCode,
                cName: cName,
                cPlan: cPlan,
            })
        }
        if (errors.length == 0) {
            await client.query(`INSERT INTO courses(coursecode,coursename,coursesyllabus,courseprogression,coursestatus)VALUES($1, $2, $3, $4, $5)`, [cCode, cName, cPlan, cProg, cStatus]);
            res.redirect("/");
        }
    } catch (err) {
        console.log(err)
    }


});

app.get("/delete/:cCode", async (req, res) => {
    debugger;
    let cCode = req.params.cCode
    try {
        client.query(`DELETE FROM courses WHERE coursecode=$1;`, [cCode], (err) => {
            if (err) {
                console.log(`${err}`)
            }
        })
        res.redirect("/");
    } catch (err) {
        console.log(err)
    }
});

app.get("/edit", async (req, res) => {
    debugger;
    let cCode = req.params.cCode
    res.render("edit", {
        errors: [],
        cCode: "",
        cName: "",
        cPlan: "",
    })
})

app.get("/about", (req, res) => {
    res.render("about")
});

app.listen(port, "0.0.0.0");