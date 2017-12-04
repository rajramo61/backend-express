let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

let userSchema = new mongoose.Schema ({
    email: String,
    password: String,
    name: String,
    description: String
});

userSchema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password')){
        return next;
    }
    bcrypt.hash(user.password, null, null, (error, hash) => {
        if(error){
            return next(error);
        }
        user.password = hash;
        next();
    })
});

module.exports = mongoose.model('Users', userSchema);