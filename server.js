const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
let db;

MongoClient.connect('mongodb://mongo:mongo@ds139929.mlab.com:39929/fcc-projects').then(connection => {
    db = connection.db();
    app.listen(process.env.PORT, () => {console.log('App started on port ' + process.env.PORT);
});
}).catch(err => console.log("Error", err));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('dist'));

app.get('/polls', (req, res) => {
   db.collection('polls').find({}, function(err, response){
    return response.toArray();
   })
  .then(pollsParsed => {res.json({polls: pollsParsed, }); });
  
  
  // db.collection('polls').find().toArray().then(polls => {
  //   const metadata = {total_count: polls.length};
  //   res.json({_metadata: metadata, polls: polls});
  // }).catch(error => {console.log(err); res.status(500).json({message: `Unable to query database ${err}`})})
});

app.get('/polls/query/:pollId', (req, res) => {
   let id = req.params.pollId;
   console.log(id);
   res.end();
   // send poll data back use react router
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

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});










































//https://www.robinwieruch.de/minimal-react-webpack-babel-setup/