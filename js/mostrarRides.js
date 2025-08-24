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
  const tbody = document.getElementById('ridesTableBody');
  tbody.innerHTML = '';

  const userRides = rides.filter(ride => ride.userEmail === loggedInUser.email);

  if (userRides.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No rides found</td></tr>`;
    return;
  }

  userRides.forEach((ride, index) => {
    const tr = document.createElement('tr');

    // From
    const fromTd = document.createElement('td');
    fromTd.textContent = ride.origin;
    fromTd.setAttribute('data-label', 'From');
    tr.appendChild(fromTd);

    // To
    const toTd = document.createElement('td');
    toTd.textContent = ride.destination;
    toTd.setAttribute('data-label', 'To');
    tr.appendChild(toTd);

    // Fee
    const feeTd = document.createElement('td');
    feeTd.textContent = `$${parseFloat(ride.fee).toFixed(2)}`;
    feeTd.setAttribute('data-label', 'Fee');
    tr.appendChild(feeTd);

    // Seats
    const seatsTd = document.createElement('td');
    seatsTd.textContent = ride.seats;
    seatsTd.setAttribute('data-label', 'Seats');
    tr.appendChild(seatsTd);

    // Car
    const carTd = document.createElement('td');
    carTd.textContent = `${ride.vehicle.marcas} ${ride.vehicle.model}`;
    carTd.setAttribute('data-label', 'Car');
    tr.appendChild(carTd);

    // Actions
    const actionsTd = document.createElement('td');
    actionsTd.setAttribute('data-label', 'Actions');

    const editLink = document.createElement('a');
    editLink.href = `edit.html?rideIndex=${index}`;
    editLink.textContent = 'Edit';

    const deleteLink = document.createElement('a');
    deleteLink.href = '#';
    deleteLink.textContent = 'Delete';
    deleteLink.style.marginLeft = '10px';
    deleteLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to delete this ride?')) {
        rides.splice(index, 1);
        localStorage.setItem('rides', JSON.stringify(rides));
        loadUserRides();
      }
    });

    actionsTd.appendChild(editLink);
    actionsTd.appendChild(document.createTextNode(' | '));
    actionsTd.appendChild(deleteLink);
    tr.appendChild(actionsTd);

    tbody.appendChild(tr);
  });
}
