function postFun() {
    const xhr = new XMLHttpRequest();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = {
        'username': username,
        'password': password
    }
    xhr.open('POST', '/');
    xhr.setRequestHeader('content-type', 'application/json');
                xhr.send(JSON.stringify(data));
}