const submit = () =>{
    username = document.getElementById('input__username').value
    password = document.getElementById('input__password').value

    let user__notvalid = 'Username not valid'
    let password__notvalid = 'Password length should be at least 7 characters long'
    
    let user__prompt;
    if(username.length<5 && password.length<7){
        user__prompt= `<small id="emailHelp" class="form-text text-muted">${user__notvalid}</small>`
        document.querySelector('#username__prompt').innerHTML = user__prompt
    }
    if (password.length<7){
        console.log('pass')
        user__prompt= `<small id="emailHelp" class="form-text text-muted">${password__notvalid}</small>`
        document.querySelector('#password__prompt').innerHTML = user__prompt
    };
};

const login = () =>{
    document.location.href = '/';
};