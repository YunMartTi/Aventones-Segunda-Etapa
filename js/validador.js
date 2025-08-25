document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login_form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            loginUser();
        });
    }

    // Control de la barra de navegación según el rol
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.role !== 'driver') {
        const myRidesLink = document.getElementById("myRidesLink");
        if (myRidesLink) myRidesLink.style.display = "none";
    }
});

function loginUser() {
    const email = document.getElementById('login_email').value;
    const password = document.getElementById('login_password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const userFound = users.find(user => user.email === email && user.password === password);

    if (userFound) {
        sessionStorage.setItem('loggedInUser', JSON.stringify(userFound));
        // Redirigir al home
        window.location.href = "Rides/home.html";
    } else {
        alert("Email or password incorrect.");
    }
}
