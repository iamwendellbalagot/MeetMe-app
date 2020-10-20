
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
        console.log(xhttp.responseURL);
        document.location.href = xhttp.responseURL;
    };
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`username=${username}&password=${password}`);

    document.getElementById('input__username').value = ''
    document.getElementById('input__password').value = ''
}