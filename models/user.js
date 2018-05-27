const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



const userSchema = mongoose.Schema({
        name: {
            type: String,
            default: ''
        },
        username: {
            type: String,
            default: ''
        },
        password: {
            type: String,
            default: ''
        }, 
        isDeleted: {
            type: Boolean,
            default: false
        },
        signUpDate: {
            type: Date,
            default: Date.now()
        }
});

userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
}

userSchema.methods.validPassword = (password, hash) => {
   return bcrypt.compareSync(password, hash);
}

module.exports = mongoose.model('User', userSchema);