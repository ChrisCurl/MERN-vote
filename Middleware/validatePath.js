const UserSession = require('../models/UserSession');
const mongoose = require('mongoose');
let db = mongoose.connection;

function validatePath (req, res, next) {
    //validate user is logged on
    const token = req.body.token;
    // if user is not logged on, trueUser is IP address
        if (req.body.userWhoisVotingIP && req.body.userWhoisVotingIP.length > 1) {
        req.body.trueUser = req.body.userWhoisVotingIP;
        next();
        } else if (req.body.token.length === 0) {
            next();
        }
    
    // validate that user is logged in with an active sesson on the database
    if (req.body.token.length > 1) {
        UserSession.findOne({"token": token}, (err, seshFound) => {
    if (seshFound) {
        req.body.userIsValidated = true;
        req.body.trueUser = seshFound.username;
        userMayEditFunc();

        if (req.body.isNewPoll) {
            next();
        }
        
    } else {
        console.log('unauthorized user');
        next();
    } 
     })
    }
    
      //validate user may edit a particular poll
      function userMayEditFunc() {
         if (req.body.userIsValidated) {
        db.collection('polls').findOne({'question': req.body.question}, (err, foundPoll) => {
            if (foundPoll) {
                 if (foundPoll.author === req.body.trueUser) {
                    req.body.userMayEdit = true;
                    next();
                 } else {
                     next();
                 }
                } 
        })
        } 
      }
       
}

module.exports = validatePath;