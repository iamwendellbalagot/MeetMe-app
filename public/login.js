
// $('html').click(() =>{
//     console.log("HTML CLICKED")
// })

// $('#submit__login').click(() =>{
//     console.log('Submitting the form')
// });

const xhttp = new XMLHttpRequest()



const submit = () =>{
    username = document.getElementById('input__username').value
    password = document.getElementById('input__password').value
    console.log(username, password)


    xhttp.open("POST", "/users/login", true);
    xhttp.onload = () =>{
        console.log(xhttp.status);
        if(xhttp.status === 200){
            document.location.href = '/';
        }
        else{
            let user__prompt= `<small id="emailHelp" class="form-text text-muted">Username and Password doesn't match </small>`
            document.querySelector('#login__prompt').innerHTML = user__prompt;
        }
    };
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`username=${username}&password=${password}`);

    document.getElementById('input__username').value = ''
    document.getElementById('input__password').value = ''
}

const signup = () => {
    document.location.href = '/users/signup';
};