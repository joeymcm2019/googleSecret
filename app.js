//require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

///https://console.cloud.google.com/apis/dashboard?utm_source=developers.google.com&utm_medium=referral&pli=1&project=super-secret-364807
const findOrCreate = require('mongoose-findorcreate');

// const authRoute = require('./auth');
// const secretRoute = require('./Secret');

//sets up server. 
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//middleware attatches authentication to req

//learn about cookie encoding
//JWT
app.use(session({
    secret: process.env.SECRET, //JWT authentication? Ensures data integrity. in cookie. sign it with secret. decodable by anything
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.dbConnect, {useNewUrlParser: true})
.then(() => console.log("database connected"))
.catch(err => console.log(err));

// app.use('/', authRoute);
// app.use('/', secretRoute);

const secretShema = new mongoose.Schema({
    secretMsg: String
});
 
 const Secret = mongoose.model('Secret', secretShema);

const userSchema = new mongoose.Schema ({
 username: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
            done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/auth/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
        console.log("profile: " + profile);
        return cb(err, user);
    });
  }
));



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

app.get('/favicon.ico', function(req, res){
    res.send(null);
   });

//Once Authorized
//Use these.
app.get('/secrets', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            console.log("fetching secrets");
            const allSecrets = await Secret.find();
            var secrets = [];
            allSecrets.forEach((secret) => secrets.push(secret.secretMsg));
            var isAuth = req.isAuthenticated();
            res.render("secrets", { secrets: secrets, isAuth: isAuth });
        } catch (err) {
            res.send(err);
        }
    } else {
        console.log("not authenticated");
        res.redirect('/');
    }
});


app.post("/submit", async (req, res) => {
    try {
        const secret = new Secret({
            secretMsg: req.body.secret
        });
        secret.save();
        res.redirect('secrets');
    } catch (err) {
        console.log(err);
        res.render("submit");
    }
});

//authentication
app.post('/register', async (req, res) =>{
    console.log("register post: ");
    try {
        const registerUser = await User.register({username: req.body.username}, req.body.password); 
        if (registerUser){
            console.log("registered user");
            passport.authenticate('local')(req, res, async function(){
                if (req.isAuthenticated()){
                    res.redirect('secrets');
                }
            });
        } else {
            res.redirect('register');
        }
    } catch (err){
        console.log("register error " +err);
        res.send("<h1>Error registering user: </h1><p>" + err + "</p><a href='/register'>Try again</a>");
    }
});

app.post('/login', (req, res)=>{
    const newUser = new User({
        username: req.body.username,
    });
    req.login(newUser, (err)=> {
        if (err){
            console.log("error loggin in: " + err);
            res.redirect('login');
        } else {
           passport.authenticate('local')(req, res, function(){
                res.redirect('secrets');
           }); 
        }
    });
});

app.get("/logout", function(req, res){
    req.logout(function(err){
        if (err)
        console.log(err);
    });
    console.log("successfully logged out");
    res.redirect("/");
  });


app.get('/google/auth', 
    passport.authenticate('google', { scope: ['profile'] })
);

app.get("/google/auth/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/secrets");
  });

