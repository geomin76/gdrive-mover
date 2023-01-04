const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const moveAllFiles = require('./service');
var bodyParser=require("body-parser");

//middlewares
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

// moveAllFiles(['DSC01552.ARW'], '1nIK4qNQ4VDIjoY99rNJEdJ0uBIYGlKsw').then(() => {
//   console.log('🔥 All files have been moved!');
// }).catch((error) => {
//     console.error(error)
// });


//rendering form.ejs
app.get("/",function(req,res){
    res.render("form");
});

// form submission
app.get('/result',(req,res)=>{
    res.render('result');
});
  
//creating form
app.post("/",function(req,res){
    var folderId = req.body.folder;
    console.log(folderId)
    var list = req.body.list;
    console.log(list)
    res.redirect("/result");
});

app.listen(PORT, console.log("Server started for port: " + PORT))
