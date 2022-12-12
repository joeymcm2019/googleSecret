// const router = require('express').Router();
// const passport = require ('passport');
// const User = require('./User');
// const findOrCreate = require('mongoose-findorcreate');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;


// //read docs on these
// passport.serializeUser(function(user, done){
//     done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//     User.findById(id, function (err, user) {
//             done(err, user);
//     });
// });

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/secrets",
//     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//         console.log("hello???");
//       return cb(err, user);
//     });
//   }
// ));

// router.post('/register', async (req, res) =>{
//     console.log("register post: ");
//     try {
//         const registerUser = await User.register({username: req.body.username}, req.body.password); 
//         if (registerUser){
//             console.log("registered user");
//             passport.authenticate('local')(req, res, async function(){
//                 if (req.isAuthenticated()){
//                     res.redirect('secrets');
//                 }
//             });
//         } else {
//             res.redirect('register');
//         }
//     } catch (err){
//         console.log("register error " +err);
//         res.send("<h1>Error registering user: </h1><p>" + err + "</p><a href='/register'>Try again</a>");
//     }
// });

// router.post('/login', (req, res)=>{
//     const newUser = new User({
//         username: req.body.username,
//     });
//     req.login(newUser, (err)=> {
//         if (err){
//             console.log("error loggin in: " + err);
//             res.redirect('login');
//         } else {
//            passport.authenticate('local')(req, res, function(){
//                 res.redirect('secrets');
//            }); 
//         }
//     });
// });

// router.get("/logout", function(req, res){
//     req.logout(function(err){
//         if (err)
//         console.log(err);
//     });
//     console.log("successfully logged out");
//     res.redirect("/");
//   });

// router.get('/auth/google', async function(req, res){
//     console.log("google auth");
//     await passport.authenticate('google', { scope: ['profile'] });
// });

module.exports = router;