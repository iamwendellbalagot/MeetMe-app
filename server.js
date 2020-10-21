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
const mongodb = require('mongodb');

const passport = require('passport');
const authenticate = require('./authenticate');

const User = require('./models/user__model');


const port = 3030;
const hostname = 'localhost';
const { v4: uuidV4 } = require('uuid');
const uri = "mongodb+srv://wendell2215:jellyman22@cluster0.u9tud.mongodb.net/<meetme>?retryWrites=true&w=majority";

mongoose.connect(uri, {useNewUrlParser:true, useUnifiedTopology: true});

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
    if(req.signedCookies.user){
        res.statusCode = 200;
        res.render('home', {username: req.signedCookies.user, roomId:uuidV4()});
    }else{
        res.redirect('/users/login');
    }
    
})

app.get('/users/login', (req, res) => {
    res.render('login')
});

app.get('/users/signup', (req, res) =>{
    res.render('signup')
});

app.get('/:room', (req, res) => {
    if(req.signedCookies.user){
        res.render('room', {roomId: req.params.room, username:req.signedCookies.user});
    }else{
        res.redirect('/users/login');
    }
});

app.get('/users/logout', (req, res) =>{
    if (req.signedCookies.user){
        res.clearCookie('user');
        res.redirect('/');
    }else {
        res.statusCode = 403;
        res.redirect('/');
    }
});



app.post('/users/signup', (req, res, next) => {
    User.register(new User({username: req.body.username}), 
      req.body.password, (err, user) => {
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
        return;
      }
      user.save((err, user) => {
        if(err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration Successful!'});
        }
      })
    });
  });
  
app.post('/users/login', passport.authenticate('local'), (req, res) => {
    res.statusCode = 200;
    res.cookie('user',req.user.username,{signed: true});
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/');
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



server.listen(process.env.PORT || port);