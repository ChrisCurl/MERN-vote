const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const UserSession = require('./models/UserSession');
const validatePath = require('./Middleware/validatePath');
let db = mongoose.connection;

// Mongo DB connection info
mongoose.connect('mongodb://mongo:mongo@ds139929.mlab.com:39929/fcc-projects');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log ('Connected to database');
});

// Middleware info
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(['/api/newPoll', '/deletePoll', '/updatePoll'], validatePath);
app.use(express.static('dist'));

// API Routes
app.get('/sessionCheck', (req, res) => {
    //admin can remotely mange session logs to force user login if needed.
    const sessionToken = req.query.token;
    UserSession.findOne({'token': sessionToken}, (err, sessionFound) => {
        sessionFound ? res.json({sessionIsValid: true}) : res.json({sessionIsValid: false})
    });
});

app.get('/polls', (req, res) => {
    // Returns all polls in database
   db.collection('polls').find({}, function(err, response){
       if (err) {
           res.json({message: 'Unable to search database'});
       }
    return response.toArray();
   })
  .then(pollsParsed => {res.json({polls: pollsParsed, }); });
});

app.post('/api/newPoll', (req, res) => {
    // Creates new poll if user is validated
        if (req.body.userIsValidated) {
            let tempPoll = req.body;
            let newPoll = {
          question: tempPoll.question, 
          options: tempPoll.options, 
          author: tempPoll.author,
          usersWhoHaveVoted: {}
          }
            db.collection('polls').insert(newPoll)
             res.json({success: true, message: 'New poll created'})
        } else {
          res.json({success: false, message: "Authentication required to submit a new poll"})
      }
  });

app.post('/updatePoll', (req, res, next) => {
      // Adds new poll option if user is validated
    if (req.body.userMayEdit && req.body.isAddingOption) {  
        db.collection('polls').findOne({"question": req.body.question}, (err, pollFound) => {
            let oldOptionLength = Object.keys(pollFound.options).length;
            let newOptionLength = Object.keys(req.body.options).length;
            if (newOptionLength - oldOptionLength === 1) {
                db.collection('polls').updateOne({"question": req.body.question},
                {$set: {"options": req.body.options}})
                .then(newPoll => res.json({success: true, message: "New option added"}));
            } else {
                res.json({success: false, message: 'Users must sumbit one option at a time'})
            }
        })
        
    } else {
         //voting logic open to all users, no validation required
            let tempPoll = req.body;
            let valueToBeUpdated = req.body.valueToBeUpdated;
            let newValue;
            //make voted users into a set
            db.collection('polls').findOne({'question': tempPoll.question}, (err, pollFound) => {
                if (pollFound.usersWhoHaveVoted[tempPoll.trueUser]) {
                    console.log('user has already voted')
                    res.json({success: false, message: 'You may only vote once'});   
                } else {
                   let tempVoterList = pollFound.usersWhoHaveVoted;
                   tempVoterList[tempPoll.trueUser] = true;
                   newValue = pollFound.options[valueToBeUpdated] += 1;
               // tempPoll.options[valueToBeUpdated] = newValue;
                db.collection('polls').updateOne({"question": tempPoll.question},
            { $set: {"options": tempPoll.options,"usersWhoHaveVoted": tempVoterList}})
            .then( newPoll => res.json({success: true, message: 'vote counted'}));
               
                }
            })
    }

});

app.post('/deletePoll', (req, res) => {
    // deletes poll if user is authenticated
    if (req.body.userMayEdit) {
        db.collection('polls').deleteOne({question: req.body.question}, (err, removed) => {
            if (removed) {
                res.json({success: true})
            }
        })
    }
    else {
        res.json({success: false, message: 'Only poll owners may delete their polls'})
    }
});

app.post('/signup', (req, res, next) => {
     const { body } = req;
     const { password } = body;
     const { passwordConfirm } = body;
     const { name } = body;
     let { userName } = body;
     if (!password || !userName) {
         return res.send({
             success: false,
             message: 'Error, user name and password cannot be empty.'
         });
     }
     
     else if (password != passwordConfirm) {
         return res.send({
             success: false,
             message: "Passwords do not match."
         });
     }
     userName = userName.toLowerCase().trim();
     // verify unique e-mail
     // save new user
    
     User.find({
         'username': userName
     }, (err, previousUsers) => {
         if (err) {
             return res.json({
                 success: false,
                 message: 'Error: Server error'
             });
         } else if (previousUsers.length > 0) {
             return res.json({
                 success: false,
                 message: 'Error: Account already exists.'
             });
         }
         
         //new user is unique, proceed with adding new user
         const newUser = new User();
         
         newUser.name = name;
         newUser.username = userName;
         newUser.password = newUser.generateHash(password);
         newUser.save((err, user) => {
             if (err) {
                 return res.json({
                     success: false,
                     message: "Error saving new user"
                 });
             }
             console.log('new user created')
             return res.json({
                 success: true,
                 message: "New User Created"
             });
         });
     });
});

app.post('/login', (req, res, next) => {
   const { body } = req;
   const { password } = body;
   let { userName } = body;
  if (!userName || !password) {
      return res.json({
          success: false,
          message: "Username and password are required"
      });
  }
  UserSession.findOne({'username': userName}, (err, sessionFound) => {
      if (err) {
          console.log(err);
      } else if (sessionFound != null) {
          res.json({message: "User allready logged in"});
      } else {
          userName = userName.trim().toLocaleLowerCase();
          User.findOne({'username': userName}, (err, user) => {
              err && res.json({success: false, message: 'Error: Invalid Query to Database'});
              if (!user) {
                  res.json({success:false, message: 'User does not exist'});
              } else if (!user.validPassword(password, user.password)) {
                  res.json({success: false, message: 'Password incorrect'}); 
              } else {
                  const userSession = new UserSession();
                  userSession.username = userName;
                  userSession.token = user._id;
                  userSession.save((err, session) => {
                    err ? res.json({success: false, message: 'Unable to log on'}) : res.json({success: true, username:user.username,
                    password: user.password, name: user.name, token: user._id}); 
                  });
                      }
          });
      }
  })
  
});

app.get('/logout', (req, res) => {
   const token = req.query.token;
   UserSession.findOne({'token': token}, (err, sessionFound) => {
       if (sessionFound) {
          UserSession.remove({token: token}, (err, sessions) => {
      if (err) {
          console.log(err);
          return res.json({message: 'Error: Server error'});
      } else {
          return res.json({
              success: true,
              message: 'User logged out sucessfully'
          });
      }
  }); 
   console.log(sessionFound.username + ' is logged out')

       }
   })
   
  
});

//Route for page not found
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});

app.listen(process.env.PORT, () => {console.log('App started on port ' + process.env.PORT)});























