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
    var prefix = req.body.prefix;
    req.session.prefix = prefix;
    var suffix = req.body.suffix;
    req.session.suffix = suffix;

    res.redirect('/result')
});

app.get('/result', async (req, res) => {
    if (!req.session.folder || !req.session.list) {
        res.render('error', {
            error: "folder or list is empty"
        })
    }

    var files = req.session.list.split(/,\s*|\s+/);
    var folderName = req.session.folder.trim().replace(/\s/g, "")
    var prefix = req.session.prefix.trim().replace(/\s/g, "")
    var suffix = req.session.suffix.trim().replace(/\s/g, "")
    for (var i = 0; i < files.length; i++) {
        files[i] = (prefix + files[i] + suffix).trim().replace(/\s/g, "")
    }

    await moveAllFiles(files, folderName, res).then(() => {
        console.log('🔥 All files have been moved!');
    }).catch((error) => {
        res.render('error', {
            error: error
        })
    });
});


app.listen(PORT, console.log("Server started for port: " + PORT))
