const express = require('express');
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server);
const morgan = require('morgan');
const { ExpressPeerServer } = require('peer');
const peerServer =  ExpressPeerServer(server, {debug: true});
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const passport = require('passport');
const authenticate = require('./authenticate');

const User = require('./models/user__model');



const port = 3030;
const hostname = 'localhost';
const { v4: uuidV4 } = require('uuid');

mongoose.connect(`mongodb://${hostname}:27017/meetme`, {useNewUrlParser:true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected succesfully on the database.')
});

app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser('12345-67890-09876-54321'));

app.use('/peerjs', peerServer);


app.use(passport.initialize());
app.use(passport.session());

const auth = (req, res, next) => {
    console.log(req.user);
    if (req.signedCookies.user === req.body.username){
        next();
    }
    if (!req.user) {
      var err = new Error('You are not authenticated!');
      err.status = 403;
      next(err);
    }
    else {
          next();
    }
}


app.get('/', (req, res) => {
    res.statusCode = 200;
    res.redirect(`/${uuidV4()}`);
    
})

app.get('/users/login', (req, res) => {
    res.render('home')
});

app.get('/:room', (req, res) => {
    console.log(req.signedCookies.user)
    if(req.signedCookies.user){
        res.render('room', {roomId: req.params.room});
    }else{
        res.end('PLEASE LOGIN')
    }
});


app.post('/users/signup', (req, res, next) => {
    User.register(new User({username: req.body.username}), 
      req.body.password, (err, user) => {
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      else {
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      }
    });
  });
  
app.post('/users/login', passport.authenticate('local'), (req, res) => {
    res.statusCode = 200;
    res.cookie('user',req.user.username,{signed: true});
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'You are successfully logged in!', name: req.user.username});
});


io.on('connection', socket => {
    socket.on('join-room', (roomId, userId)=>{
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);

        socket.on('message', (message, username) => {
            let msgTime = new Date().toLocaleTimeString();
            io.to(roomId).emit('createMessage', message, msgTime, username);
        })
    });
});



server.listen(process.env.PORT || port, hostname, () =>{
    console.log('Server is connected in port 3030.')
});