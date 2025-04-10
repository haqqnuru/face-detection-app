const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
require('dotenv').config();
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const knex = require('knex')


// call the database
const db = knex({
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: '1234',
      database: 'facebrain',
    },
  });

//this creates the “connection” to Clarifai’s services
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.CLARIFAI_API_KEY}`);

// This initializes the Express app.
const app = express();
//This lets Express parse incoming JSON in request bodies.
app.use(bodyParser.json());
//This allows the frontend to make requests to the backend without being blocked.
app.use(cors());

// Test only - when you have a database variable you want to use
app.get('/', (req, res) => {
    res.send(database.users);
});

// This accesses the data you input in the signin page.
app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
      .where('email', '=', req.body.email)
      .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
          return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
              res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
          res.status(400).json('wrong credentials')
        }
      })
      .catch(err => res.status(400).json('wrong credentials'))
  })

// This accesses the data you input in the register page.
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
      db.transaction(trx => {
        trx.insert({
          hash: hash,
          email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0].email,
              name: name,
              joined: new Date()
            })
            .then(user => {
              res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => res.status(400).json('unable to register'))
  })
  
// This route is used to retrieve a user’s profile based on their ID
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    db.select ('*').from('users').where
    ({ id})
    .then(user => {
        if (user.length) {
            res.json(user[0]);  
        } else {
            res.status(400).json('Not found');
}
       
    }) 
    .catch(err => res.status(400).json('Error getting users'));
});

// This receives an image URL and user ID and then runs face detection using Clarifai
app.put('/image', (req, res) => {
  const { id, input } = req.body;

  stub.PostModelOutputs(
    {
      model_id: "face-detection",
      inputs: [{ data: { image: { url: input } } }]
    },
    metadata,
    (err, response) => {
      const faceRegions = response?.outputs?.[0]?.data?.regions;

      if (err || !faceRegions || faceRegions.length === 0) {
        console.log("No faces detected or error:", err || response);
        return res.json({
          entries: null,
          clarifaiResponse: response
        });
      }

      db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
          res.json({
            entries: entries[0].entries,
            clarifaiResponse: response
          });
        })
        .catch(err => {
          console.error("DB update error:", err);
          res.status(400).json("Unable to update entries");
        });
    }
  );
});

//This starts your Express server on port 3000 and logs a message to confirm it's running.
app.listen(3000, () => {
    console.log('App is running on port 3000');
});
