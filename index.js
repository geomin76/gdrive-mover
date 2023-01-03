const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const moveAllFiles = require('./service');
var bodyParser=require("body-parser");

//middlewares
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

// moveAllFiles(['DSC01554.ARW', 'DSC01553.ARW'], '1nIK4qNQ4VDIjoY99rNJEdJ0uBIYGlKsw').then(() => {
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
    var username=req.body.username;
    console.log(username);
    var email=req.body.email;
    res.redirect("/result");
});

app.listen(PORT, console.log("Server don start for port: " + PORT))
