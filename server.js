const express = require('express');
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server);
const morgan = require('morgan');
const { ExpressPeerServer } = require('peer');
const peerServer =  ExpressPeerServer(server, {debug: true});

const port = 3030;
const hostname = 'localhost';
const { v4: uuidV4 } = require('uuid');

app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);


app.get('/', (req, res) => {
    res.statusCode = 200;
    res.redirect(`/${uuidV4()}`);
})

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room});
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