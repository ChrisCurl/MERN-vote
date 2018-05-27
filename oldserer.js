const express = require('express');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const User = require('./models/user');
const UserSession = require('./models/UserSession');
let db = mongoose.connection;

mongoose.connect('mongodb://mongo:mongo@ds139929.mlab.com:39929/fcc-projects');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log ('Connected to database');
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());
// cookie parser not needed, just use express-session

app.use(express.static('dist'));

app.get('/polls', (req, res) => {
  db.collection('polls').find({}, function(err, response){
      if (err) {
          res.json({message: 'Unable to search database'});
      }
    return response.toArray();
  })
  .then(pollsParsed => {res.json({polls: pollsParsed, }); });
});

app.post('/newPoll', (req, res) => {
  let newPoll = req.body;
  db.collection('polls').insert(newPoll).then(
      newpoll => res.json(newpoll)
      );
});

app.post('/updatePoll', (req, res) => {
    let updatedPoll = req.body;
    db.collection('polls').updateOne(
        {"question": updatedPoll.question},
        { $set: {"options": updatedPoll.options
        }}
        ).then( newPoll => res.json(newPoll)
        );
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
  userName = userName.trim().toLocaleLowerCase();
  console.log('here')
  User.find({'username': userName}, (err, users) => {
      err && res.json({success: false, message: 'Error: Invalid Query to Database'});
      users && res.json({users: users});
    //   res.json({users});
  });
  User.find({
      'username': userName
  }, (err, users) => {
      console.log('error');
      if (err) {
          console.log(err);
          res.json({
              success: false,
              message: 'Error: Invalid query to database'
          });
      }
      const user = users[0];
      if (!user.validPassword(password)) {
          return res.json({
              success: false,
              message: 'Password incorrect'
          });
      } else {
                    console.log('invalid password')

          const userSession = new UserSession();
          userSession.username = userName;
          userSession.save((err, doc) => {
            //   if (err) {
            //       console.log(err);
            //       return res.json({
            //           success: false,
            //           message: 'Unable to log on'
            //       });
            //   } else {

            //       return res.json({
            //           success: true,
            //           message: 'Log in succeded',
            //           token: doc._id
            //       });
            //   }
          });
      }
  });
   
});

app.get('./logout', (req, res) => {
  const { query } = req;
  const { token } = query;
   
  UserSession.findOneAndUpdate({
      _id: token,
      isDeleted: false
  }, {
      $set: {
          isDeleted: true
      }
  }, null, (err, sessions) => {
      if (err) {
          console.log(err);
          return res.json({
              success: false,
              message: 'Error: Server error'
          });
      } else {
          return res.json({
              success: true,
              message: 'User logged out sucessfully'
          });
      }
  });
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});

app.listen(process.env.PORT, () => {console.log('App started on port ' + process.env.PORT)});























