document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('ridesTableBody')) {
        loadUserRides();
    }
});

function loadUserRides() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('Please log in to see your rides.');
        window.location.href = '../index.html';
        return;
    }

    const rides = JSON.parse(localStorage.getItem('rides')) || [];
    const userRides = rides.filter(ride => ride.userEmail === loggedInUser.email);

    const tbody = document.getElementById('ridesTableBody');
    tbody.innerHTML = ''; // limpiar contenido

    if (userRides.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No rides found</td></tr>`;
        return;
    }

    userRides.forEach((ride, index) => {
        const tr = document.createElement('tr');

        // Datos básicos
        const fromTd = document.createElement('td');
        fromTd.textContent = ride.origin;
        tr.appendChild(fromTd);

        const toTd = document.createElement('td');
        toTd.textContent = ride.destination;
        tr.appendChild(toTd);

        const seatsTd = document.createElement('td');
        seatsTd.textContent = ride.seats;
        tr.appendChild(seatsTd);

        const carTd = document.createElement('td');
        carTd.textContent = `${ride.vehicle.marcas} ${ride.vehicle.model}`;
        tr.appendChild(carTd);

        const feeTd = document.createElement('td');
        feeTd.textContent = `$${parseFloat(ride.fee).toFixed(2)}`;
        tr.appendChild(feeTd);

        // Actions Editar, Eliminar
        const actionsTd = document.createElement('td');

        // Edit link
        const editLink = document.createElement('a');
        editLink.href = `edit.html?rideIndex=${index}`;
        editLink.textContent = 'Edit';

        // Delete link
        const deleteLink = document.createElement('a');
        deleteLink.href = '#';
        deleteLink.textContent = 'Delete';
        deleteLink.style.marginLeft = '10px';
        deleteLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to delete this ride?')) {
                deleteRide(index);
            }
        });

        actionsTd.appendChild(editLink);
        actionsTd.appendChild(document.createTextNode(' | '));
        actionsTd.appendChild(deleteLink);
        tr.appendChild(actionsTd);

        tbody.appendChild(tr);
    });

    function deleteRide(index) {
        rides.splice(index, 1);
        localStorage.setItem('rides', JSON.stringify(rides));
        loadUserRides();
    }
}
