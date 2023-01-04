const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const moveAllFiles = require('./service');
var bodyParser = require("body-parser");
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(session({ secret: "rainbow cat" }));

//middlewares
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.render("form");
});

app.post("/", function (req, res) {
    var folder = req.body.folder;
    req.session.folder = folder;
    var list = req.body.list;
    req.session.list = list;

    res.redirect('/result')
});

app.get('/result', (req, res) => {
    console.log(req.session.folder)
    console.log(req.session.list)
    moveAllFiles(req.session.list, req.session.folder).then(() => {
      console.log('🔥 All files have been moved!');
    }).catch((error) => {
        console.error(error)
    });
    res.render('result');

    // try to render results with progress bar, is that possible?
});


app.listen(PORT, console.log("Server started for port: " + PORT))
