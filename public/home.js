xhttp = new XMLHttpRequest();


const logout = () => {
    xhttp.open("GET", '/users/logout', true)
    xhttp.onload = () =>{
        document.location.href = '/'
    };
    xhttp.send();
};

const createRoom = () =>{
    document.location.href = ROOM_ID;
}

const joinRoom = () =>{
    room_id = document.getElementById('input__roomid').value;
    if(room_id.length > 10){
        document.location.href = room_id;
        document.getElementById('input__roomid').value = '';
    }
    else{
        return;
    }
}