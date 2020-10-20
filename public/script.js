
const socket = io('/');
var peer =  new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
});

const username = 'username';

// const myVideo = document.querySelector('#videoElement');
let  myVideoStream;
const myVideo = document.createElement('video');
myVideo.muted = true;
const videoGrid = document.getElementById('video-grid')

//Connect to camera and audio
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(function (stream) {
        myVideoStream = stream;
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

$('.mic__icon').click(() =>{
    let mic_status = myVideoStream.getAudioTracks()[0].enabled;
    
    if(mic_status){
        myVideoStream.getAudioTracks()[0].enabled = false;
        icon_element = `
            <i class="fas fa-microphone-alt-slash"></i>
            <span>Mic is off</span>
        `
        document.querySelector('.mic__icon').innerHTML = icon_element;
    }
    else{
        myVideoStream.getAudioTracks()[0].enabled = true;
        icon_element = `
            <i class="fas fa-microphone-alt"></i>
            <span>Mic is on</span>
        `
        document.querySelector('.mic__icon').innerHTML = icon_element;
    }
});

$('.camera__icon').click(() =>{
    let camera_status = myVideoStream.getVideoTracks()[0].enabled;
    
    if(camera_status){
        myVideoStream.getVideoTracks()[0].enabled = false;
        icon_element = `
            <i class="fas fa-video-slash"></i>
            <span>Cam is off</span>
        `
        document.querySelector('.camera__icon').innerHTML = icon_element;
    }
    else{
        myVideoStream.getVideoTracks()[0].enabled = true;
        icon_element = `
            <i class="fas fa-video"></i>
            <span>Cam is on</span>
        `
        document.querySelector('.camera__icon').innerHTML = icon_element;
    }
});

let msg = $('input');
$('html').keydown(key => {
    if( key.which === 13 && msg.val().length !== 0 ){
        socket.emit('message', msg.val(), username)
        msg.val('');
    }
    else{
        return;
    }
})
$('#send').click(() => {
    if(msg.val().length !== 0){
        socket.emit('message', msg.val());
        msg.val('');
    }else{
        return;
    };
    
})
$('#leave__meeting').click(() =>{
    console.log('Leave')
    xhttp = new XMLHttpRequest()
    xhttp.open('GET', '/users/logout', true);
    xhttp.onload = () =>{
        document.location.href = xhttp.responseURL;
    };
    xhttp.setRequestHeader("Content-type", "text/plain");
    xhttp.send();
});

socket.on('createMessage', (message, msgTime, username_server) => {
    $('.message__container').append(
        `   
            <div class="text__box">
                <span class="msg__userId">user: ${username_server}</span><br>
                ${message}<br>
                <span class="msg__time">${msgTime}</span>
                
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
