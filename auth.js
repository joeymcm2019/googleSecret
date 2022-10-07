const router = require('express').Router();
const passport = require ('passport');
const User = require('./User');

passport.use(User.createStrategy());


//read docs on these
passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
            done(err, user);
    });
});

//22:56
router.post('/register', async (req, res) =>{
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

router.post('/login', (req, res)=>{
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

module.exports = router;