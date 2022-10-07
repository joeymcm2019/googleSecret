require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const ejs = require("ejs");

const authRoute = require('./auth');
const secretRoute = require('./Secret');

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());

app.use(passport.session());

mongoose.connect(process.env.dbConnect, {useNewUrlParser: true})
.then(() => console.log("database connected"))
.catch(err => console.log(err));

app.use('/', authRoute);
app.use('/', secretRoute);

app.listen(process.env.PORT || 3000, () => console.log("server running"));

app.get("/", function(req, res){
    if (req.isAuthenticated()){
        console.log("already logged in");
        res.redirect('secrets');
    } else {
    res.render('home');
    }
});

app.get('/register', function(req, res){
    if (req.isAuthenticated()){
        console.log("already logged in");
        res.redirect('secrets');
    } else {
    res.render('register');
    }
});

app.get('/login', function(req, res){
    if (req.isAuthenticated()){
        console.log("already logged in");
        res.redirect('secrets');
    } else {
    res.render('login');
    }
});

app.get('/submit', (req, res)=>{
    console.log("get submit");
    if (req.isAuthenticated()){
        res.render("submit");     
    } else {
        res.redirect('/');
    }
});

app.get("/logout", function(req, res){
    req.logout(function(err){
        if (err) {
            console.log(err);
        } else {
            console.log("successfully logged out");
        }

    });
    res.redirect("/");
  });





