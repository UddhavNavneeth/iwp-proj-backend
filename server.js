const express = require('express');
const _ = require('lodash');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const {User} = require('./models/user');
const {Post} = require('./models/post');
const {withAuth} = require('./middleware/authenticate');

const app = express();
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({credentials: true,
    origin: 'http://localhost:3000',
    exposedHeaders: ['Authorization']
  }));

port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('<h1>Heroku Check</h1>');
})

app.get('/api/home',(req, res) => {
    console.log(req.cookies);
    res.send('Welcome to the Express Community!');
});

app.post('/api/secret', withAuth, (req, res) => {
    res.send(`The username is ${req.username}`);
});

app.get('/checkToken', withAuth, (req, res) => {
    res.sendStatus(200);
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
// app.post('/api/login', (req, res) => {
//     const { username, password } = req.body;
//     User.findOne({username}).then((user) => {
//         if (!user) {
//             return Promise.reject('Not a valid username');
//             console.log(aa)
//         }
//         user.isCorrectPassword(password).then((res) => {
//             const payload = { username };
//             const token = jwt.sign(payload, secret, {
//               expiresIn: '1h'
//             });
//             res.cookie('token', token, { httpOnly: true })
//             .send('Succesfully Logged In');
//         })
        
//     }).catch((e) => {
//         res.send(`Error in authenticating: ${e}`);
//     })
// })

// app.post('/api/login', (req, res) => {
//     const { username, password } = req.body;
//     User.findOne({username}).then((user) => {
//         if (!user) {
//             Promise.reject(`No user`);
//         }
//         user.isCorrectPassword(password, function(err, same) {
//             if (err) {
//               res.status(500)
//                 .json({
//                   error: 'Internal error please try again'
//               });
//             } else if (!same) {
//               res.status(401)
//                 .json({
//                   error: 'Incorrect username or password'
//               });
//             } else {
//               // Issue token
//               const payload = { username };
//               const token = jwt.sign(payload, secret, {
//                 expiresIn: '1h'
//               });
//               res.cookie('token', token, { httpOnly: true })
//                 .send('Succesfully Logged In');
//             }
//           });
//     }).catch((e) => {
//         res.send(e);
//     })
// })

app.post('/api/authenticate', function(req, res) {
    const { username, password } = req.body;
    User.findOne({ username }, function(err, user) {
      if (err) {
        console.error(err);
        res.status(500)
          .json({
          error: 'Internal error please try again'
        });
      } else if (!user) {
        res.status(401)
          .json({
            error: 'Incorrect username or password'
          });
      } else {
        user.isCorrectPassword(password, function(err, same) {
          if (err) {
            res.status(500)
              .json({
                error: 'Internal error please try again'
            });
          } else if (!same) {
            res.status(401).json({
                error: 'Incorrect email or password'
            });
          } else {
            // Issue token
            const payload = { username };
            const token = jwt.sign(payload, secret, {
              expiresIn: '1h'
            });
            user1 = {...user["_doc"]};
            user1.token = token;
            // console.log(user1);
            res.send(user1).status(200);
            // res.cookie('token', token, { expires: new Date(Date.now() + 900000) })
            //   .sendStatus(200);
          }
        });
      }
    });
  });

  app.post('/getUsers', withAuth, (req,res) => {
    User.find({username: {$ne : req.username}}).then((doc) => {
        res.send(doc);
    }).catch((e) => {
        res.send(e);
    })
  })

  app.post('/getPosts', withAuth, (req,res) => {
    Post.find({owner: {$ne : req.username}}).then((doc) => {
      res.send(doc);
    }).catch((e) => {
      res.send(e);
    })
  })

  app.post('/getMyPosts', withAuth, (req, res) => {
    Post.find({owner: req.username}).then((doc) => {
      res.send(doc);
    }).catch((e) => {
      res.send(e);
      console.log(e);
    })
  })

  app.post('/newPost', withAuth, (req,res) => {
    let message = req.body.message;
    let owner = req.username;
    let post = new Post({
        owner: owner,
        message: message,
        likes: 0
    });

    post.save().then((doc) => {
        res.send(doc);
    }).catch((e) => {
        res.send(e);
    })
  })

  app.post('/addLike', withAuth, async (req, res) => {
    try {
      const myPost = await Post.findById(req.body.id);
      
      myPost.likes = myPost.likes + 1;

      myPost.save().then((resp) => {
        res.send(resp);
      }).catch((e) => {
        res.send(e);
      })

    } catch(e) {
      console.log(e);
      res.send(e);
    }
  })

  app.post('/addFriend', (req, res) => {
      User.findOne({username: req.username}).then((doc) => {
          doc.friends.push(req.body.friend);
          doc.save().then((result) => {
              res.send(result);
          })
      }).catch((e) => {
          res.send(e);
      })
  })


  //??????????????
  app.get('/logout', withAuth, (req,res) => {
      res.clearCookie('token');
  })

app.listen(port);
console.log(`Server is up on port ${port}`);