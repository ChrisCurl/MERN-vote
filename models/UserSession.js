const mongoose = require('mongoose');

const UserSessionSchema = mongoose.Schema({
    username: {
        type: String,
        default: ''
    },
     token: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('UserSession', UserSessionSchema);