
const socket = io('/');
var peer =  new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
});

// const myVideo = document.querySelector('#videoElement');
const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid')

//Connect to camera and audio
navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
        addVideoStream(myVideo, stream);

        peer.on('call', call =>{
            call.answer(stream);
            const video = document.createElement('video');
            addVideoStream(video, stream);
        })

        socket.on('user-connected', (userId) =>{
            connectToNewUSer(userId, stream);
        });
});


let msg = $('input');
$('html').keydown(key => {
    if( key.which === 13 && msg.val().length !== 0 ){
        socket.emit('message', msg.val())
        msg.val('');
    }
    else{
        return;
    }
})
$('#send').click(() => {
    socket.emit('message', msg.val());
    msg.val('');
})

socket.on('createMessage', message => {
    $('.message__container').append(
        `   <div class="text__box">
                ${message}
            </div>
        `
    );
    $('.chat__body').scrollTop($('.chat__body').prop('scrollHeight'));
})

//open peer-to-peer connection
peer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id);
});

const connectToNewUSer = (userId, stream) =>{
    const call = peer.call(userId, stream);
    const video = document.createElement('video');  
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    });
};

//Add the video stream on the layout
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
}
