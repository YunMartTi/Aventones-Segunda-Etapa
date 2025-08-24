document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('login_form')
        .addEventListener('submit', function (event) {
            event.preventDefault();
            loginUser();
        });
});

function loginUser() {
    const email = document.getElementById('login_email').value;
    const password = document.getElementById('login_password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    let userFound = users.find(user => user.email === email && user.password === password);

    if (userFound) {
    sessionStorage.setItem('loggedInUser', JSON.stringify(userFound));

    if (userFound.role === 'driver') {
        window.location.href = "Rides/home.html";
    } else {
        window.location.href = "Rides/home.html";
        document.getElementById("myRidesLink").style.display = "none";

    }
}

}
