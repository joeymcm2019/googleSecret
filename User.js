const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema ({
    username: {type: String, required: true, unique: true}, 
});

userSchema.plugin(passportLocalMongoose);

//const User = new mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema);