xhttp = new XMLHttpRequest();

const submit = () =>{
    username = document.getElementById('input__username').value
    password = document.getElementById('input__password').value
    confirmPassword = document.getElementById('input__confirm__password').value

    let user__notvalid = 'Username not valid'
    let user__exist = 'Username is not available'
    let password__notvalid = 'Password should be at least 7 characters long'
    let password__notmatched = "Password doesn't match"
    
    let user__prompt;
    if(username.length<5){
        user__prompt= `<small id="emailHelp" class="form-text text-muted">${user__notvalid}</small>`
        document.querySelector('#username__prompt').innerHTML = user__prompt
    }

    if(username.length>=5){
        user__prompt= `<small id="emailHelp" class="form-text text-muted"></small>`
        document.querySelector('#username__prompt').innerHTML = user__prompt
    }
    if (password.length<7){
        user__prompt= `<small id="emailHelp" class="form-text text-muted">${password__notvalid}</small>`
        document.querySelector('#password__prompt').innerHTML = user__prompt
    };

    if (password.length>=7){
        user__prompt= `<small id="emailHelp" class="form-text text-muted"></small>`
        document.querySelector('#password__prompt').innerHTML = user__prompt
    };

    if (password !== confirmPassword){
        user__prompt= `<small id="emailHelp" class="form-text text-muted">${password__notmatched}</small>`
        document.querySelector('#password__prompt').innerHTML = user__prompt
    }

    if(password.length>=7 && username.length>=5 && password === confirmPassword){
        xhttp.open('POST', '/users/signup',true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(`username=${username}&password=${password}`);
        xhttp.onload = () =>{
            let server_response = xhttp.status;
            if(server_response === 500){
                user__prompt= `<small id="emailHelp" class="form-text text-muted">${user__exist}</small>`
                document.querySelector('#username__prompt').innerHTML = user__prompt;
                return;
            }
            else if (server_response === 200){
                document.location.href = '/'
            }
        };
        
    };
};

const login = () =>{
    document.location.href = '/';
};