const express = require("express")
const app = express();
const port = 3000;
const bodyParser = require("body-parser")
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())

const courses = [];

app.get("/", (req, res) => {
    res.render("index")
});

app.get("/addcourse", (req, res) => {

    res.render("addcourse", {
        errors: [],
        cCode: "",
        cName: "",
        cPlan: "",
    });

});

app.post("/addcourse", (req, res) => {
    debugger;
    const errors = [];
    errors.length = 0;
    let cCode = req.body.cCode;
    let cName = req.body.cName;
    let cPlan = req.body.cPlan;
    let cProg = req.body.cProg;
    let cStatus = req.body.cStatus
    if (cCode == "") {
        errors.push(`Du måste fylla i kurskod.`)
    }

    if (cName == "") {
        errors.push(`Du måste fylla i kursnamn.`)
    }

    if (cPlan == "") {
        errors.push(`Du måste ange fullständig länk för kursplanen.`)
    }

    if (errors.length > 0) {
        res.render("addcourse", {
            errors: errors,
            cCode: cCode,
            cName: cName,
            cPlan: cPlan,
        })
        console.log(errors)

    } else {
        courses.push(req.body)
        console.log(courses)
        res.render("index", {
            courses,
            errors: errors,
        })
    }


})

app.get("/about", (req, res) => {
    res.render("about")
});

app.listen(port, () => {
    console.log("Applikation ansluten till " + port)
})