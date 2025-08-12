document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('driverRegistration_form')
        .addEventListener('submit', function (event) {
            event.preventDefault();
            storeInputs();
        });
});

function storeInputs() {
    const fName = document.getElementById('fName').value;
    const lName = document.getElementById('lName').value;
    const email = document.getElementById('email').value;
    const cedula = document.getElementById('cedula').value;
    const birthday = document.getElementById('birthday').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;
    const address = document.getElementById('address').value;
    const country = document.getElementById('country').value;
    const state = document.getElementById('state').value;
    const city = document.getElementById('city').value;
    const number = document.getElementById('number').value;
    const role = document.getElementById('role').value;
    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const id = document.getElementById('id').value;

    if (password !== password2) {
        alert('Passwords do not match. Please try again.');
        return false;
    }

    let userData; // declaración de variable fuera del if para que esté disponible en todo el bloque

    if (role === 'driver') {
        userData = {
            fName,
            lName,
            cedula,
            birthday,
            email,
            password,
            address,
            country,
            state,
            city,
            number,
            role,
            vehicles: [
                {
                    brand,
                    model,
                    year,
                    id
                }
            ]
        };
    } else {
        userData = {
            fName,
            lName,
            cedula,
            birthday,
            email,
            password,
            address,
            country,
            state,
            city,
            number,
            role
        };
    }


    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful!');
    document.getElementById('driverRegistration_form').reset();
    return true;
}
