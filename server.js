const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {User} = require('./models/user');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.get('/api/home',(req, res) => {
    res.send('Welcome!');
});

app.get('/api/secret', (req, res) => {
    res.send('The password is potato');
});

app.post('/api/signup', (req, res) => {
    let { username, password, email, name, gender} = req.body;
    console.log(req.body);
    let hash = bcrypt.hashSync(password, 8);
    // const user = new User(req.body);
    const user = new User({
        username: username,
        password: hash,
        email: email,
        name: name,
        gender: gender 
    });

    user.save().then((doc) => {
        res.status(200).send(doc);
    }).catch((e) => {
        res.status(500).send(e);
    });


})


const secret = 'uddhav';
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({username}).then((user) => {
        user.isCorrectPassword(password, function(err, same) {
            if (err) {
              res.status(500)
                .json({
                  error: 'Internal error please try again'
              });
            } else if (!same) {
              res.status(401)
                .json({
                  error: 'Incorrect username or password'
              });
            } else {
              // Issue token
              const payload = { username };
              const token = jwt.sign(payload, secret, {
                expiresIn: '1h'
              });
              res.cookie('token', token, { httpOnly: true })
                .send('Succesfully Logged In');
            }
          });
    }).catch((e) => {
        res.send(e);
    })
})

app.post('/api/authenticate', function(req, res) {
    const { email, password } = req.body;
    User.findOne({ email }, function(err, user) {
      if (err) {
        console.error(err);
        res.status(500)
          .json({
          error: 'Internal error please try again'
        });
      } else if (!user) {
        res.status(401)
          .json({
            error: 'Incorrect email or password'
          });
      } else {
        user.isCorrectPassword(password, function(err, same) {
          if (err) {
            res.status(500)
              .json({
                error: 'Internal error please try again'
            });
          } else if (!same) {
            res.status(401)
              .json({
                error: 'Incorrect email or password'
            });
          } else {
            // Issue token
            const payload = { email };
            const token = jwt.sign(payload, secret, {
              expiresIn: '1h'
            });
            res.cookie('token', token, { httpOnly: true })
              .sendStatus(200);
          }
        });
      }
    });
  });

app.listen(8000);
console.log(`Server is up on port 8000`);