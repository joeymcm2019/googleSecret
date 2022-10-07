const router = require('express').Router();

const Secret = require("./secrets");


// router.get('/', (req, res)=>{
//     if (req.isAuthenticated()){
//         res.redirect('/secrets');
//     } else {
//      res.render('home');
//     } 
// });

// router.get('/register', (req, res)=> {
//     if (req.isAuthenticated()){
//         res.redirect('/secrets');
//     } else {
//         res.redirect('/register');
//     }
// });

// router.get('/login', (req, res)=> {
//     if (req.isAuthenticated()){
//         res.redirect('/secrets');
//     } else {
//         res.redirect('/login');
//     }
// });

router.get('/secrets', async (req, res) => {
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


router.post("/submit", async (req, res)=>{
    try {
        const secret = new Secret({
            secretMsg: req.body.secret
        });
        secret.save();
        res.redirect('secrets');
    } catch (err){
        console.log(err);
        res.render("submit");
    }
});

module.exports = router;
