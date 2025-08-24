document.addEventListener('DOMContentLoaded', () => {
  // Página myRides
  if (document.getElementById('ridesTableBody')) {
    loadUserRides();
  }

  // Página editar ride
  if (document.getElementById('editRideForm')) {
    loadRideForEdit();
  }

  // Página hbuscador
  if (document.querySelector('.search-box form')) {
    setupSearchForm();
  }

  // Página crear ride
  const addRideForm = document.getElementById('addRideForm');
  if (addRideForm) {
    addRideForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const origin = addRideForm.origin.value.trim();
      const destination = addRideForm.destination.value.trim();

      const daysCheckboxes = addRideForm.querySelectorAll('input[name="days[]"]:checked');
      const days = Array.from(daysCheckboxes).map(cb => cb.value);

      const time = addRideForm.time.value;
      const seats = parseInt(addRideForm.seats.value, 10);
      const fee = parseFloat(addRideForm.fee.value);

      const marcas = addRideForm.marcas.value.trim();
      const model = addRideForm.model.value.trim();
      const year = parseInt(addRideForm.year.value, 10);

      if (!origin || !destination || days.length === 0 || !time || !seats || isNaN(fee) || !marcas || !model || isNaN(year)) {
        alert('Please fill all required fields correctly.');
        return;
      }

      const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
      if (!loggedInUser) {
        alert('Please log in before adding a ride.');
        window.location.href = '../index.html';
        return;
      }

      const newRide = {
        origin,
        destination,
        days,
        time,
        seats,
        fee,
        vehicle: {
          marcas,
          model,
          year
        },
        userEmail: loggedInUser.email
      };

      const rides = JSON.parse(localStorage.getItem('rides')) || [];
      rides.push(newRide);
      localStorage.setItem('rides', JSON.stringify(rides));

      alert('Ride created successfully!');
      window.location.href = 'myRides.html';
    });
  }
});

// Carga y muestra rides del usuario actual
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

  // Filtra solo los rides del usuario logueado
  const userRides = rides.filter(ride => ride.userEmail === loggedInUser.email);

  if (userRides.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No rides found</td></tr>`;
    return;
  }

  userRides.forEach((ride, index) => {
    const tr = document.createElement('tr');

    // Asegurarse que el orden de td coincide con el thead
    const fromTd = document.createElement('td');   // 1
    fromTd.textContent = ride.origin;
    tr.appendChild(fromTd);

    const toTd = document.createElement('td');     // 2
    toTd.textContent = ride.destination;
    tr.appendChild(toTd);

    const feeTd = document.createElement('td');    // 3
    feeTd.textContent = `$${parseFloat(ride.fee).toFixed(2)}`;
    tr.appendChild(feeTd);

    const seatsTd = document.createElement('td');  // 4
    seatsTd.textContent = ride.seats;
    tr.appendChild(seatsTd);

    const carTd = document.createElement('td');    // 5
    carTd.textContent = `${ride.vehicle.marcas} ${ride.vehicle.model} ${ride.vehicle.year}`;
    tr.appendChild(carTd);

    const actionsTd = document.createElement('td'); // 6

    const editLink = document.createElement('a');
    editLink.href = `edit.html?rideIndex=${index}`; // usar index directo
    editLink.textContent = 'Edit';

    const deleteLink = document.createElement('a');
    deleteLink.href = '#';
    deleteLink.textContent = 'Delete';
    deleteLink.style.marginLeft = '10px';
    deleteLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to delete this ride?')) {
        // Eliminar del localStorage
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


// Carga ride para editar y guarda cambios
function loadRideForEdit() {
  const params = new URLSearchParams(window.location.search);
  const rideIndex = params.get('rideIndex');

  if (rideIndex === null) {
    alert('No ride selected to edit.');
    window.location.href = 'myRides.html';
    return;
  }

  const rides = JSON.parse(localStorage.getItem('rides')) || [];
  const ride = rides[rideIndex];

  if (!ride) {
    alert('Ride not found.');
    window.location.href = 'myRides.html';
    return;
  }

  document.getElementById('origin').value = ride.origin;
  document.getElementById('destination').value = ride.destination;

  document.querySelectorAll('input[name="days[]"]').forEach(cb => cb.checked = false);
  if (ride.days && ride.days.length > 0) {
    ride.days.forEach(day => {
      const cb = document.querySelector(`input[name="days[]"][value="${day}"]`);
      if (cb) cb.checked = true;
    });
  }

  document.getElementById('time').value = ride.time;
  document.getElementById('seats').value = ride.seats;
  document.getElementById('fee').value = ride.fee;

  document.getElementById('marcas').value = ride.vehicle.marcas;
  document.getElementById('model').value = ride.vehicle.model;
  document.getElementById('year').value = ride.vehicle.year;

  const form = document.getElementById('editRideForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const updatedOrigin = document.getElementById('origin').value.trim();
    const updatedDestination = document.getElementById('destination').value.trim();

    const updatedDaysCheckboxes = document.querySelectorAll('input[name="days[]"]:checked');
    const updatedDays = Array.from(updatedDaysCheckboxes).map(cb => cb.value);

    const updatedTime = document.getElementById('time').value;
    const updatedSeats = parseInt(document.getElementById('seats').value, 10);
    const updatedFee = parseFloat(document.getElementById('fee').value);

    const updatedMarcas = document.getElementById('marcas').value.trim();
    const updatedModel = document.getElementById('model').value.trim();
    const updatedYear = parseInt(document.getElementById('year').value, 10);

    if (!updatedOrigin || !updatedDestination || !updatedTime || !updatedSeats || isNaN(updatedFee) || !updatedMarcas || !updatedModel || isNaN(updatedYear)) {
      alert('Please fill all required fields.');
      return;
    }

    rides[rideIndex] = {
      ...rides[rideIndex],
      origin: updatedOrigin,
      destination: updatedDestination,
      days: updatedDays,
      time: updatedTime,
      seats: updatedSeats,
      fee: updatedFee,
      vehicle: {
        marcas: updatedMarcas,
        model: updatedModel,
        year: updatedYear
      }
    };

    localStorage.setItem('rides', JSON.stringify(rides));
    alert('Ride updated successfully!');
    window.location.href = 'myRides.html';
  });
}

// Setup del formulario de búsqueda en home y mostrar resultados
function setupSearchForm() {
  const form = document.querySelector('.search-box form');
  const resultsDiv = document.querySelector('.results');
  if (!form || !resultsDiv) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const from = form.elements['from'].value;
    const to = form.elements['to'].value;

    const daysCheckboxes = form.querySelectorAll('input[name="days[]"]:checked');
    const selectedDays = Array.from(daysCheckboxes).map(cb => cb.value);

    const rides = JSON.parse(localStorage.getItem('rides')) || [];

    const dayToAbbr = {
      Monday: "Mon",
      Tuesday: "Tue",
      Wednesday: "Wed",
      Thursday: "Thu",
      Friday: "Fri",
      Saturday: "Sat",
      Sunday: "Sun"
    };

    const filteredRides = rides.filter(ride => {
      if (ride.origin !== from) return false;
      if (ride.destination !== to) return false;

      if (!ride.days || ride.days.length === 0) return false;

      const rideDaysAbbr = ride.days.map(d => dayToAbbr[d]);
      return rideDaysAbbr.some(d => selectedDays.includes(d));
    });

    let html = '';
    if (filteredRides.length === 0) {
      html = '<p>No rides found for selected filters.</p>';
    } else {
      html = `
      <p>Rides found from <strong><em>${from}</em></strong> to <strong><em>${to}</em></strong></p>
      <table>
        <thead>
          <tr>
            <th>Driver</th>
            <th>From</th>
            <th>To</th>
            <th>Seats</th>
            <th>Car</th>
            <th>Fee</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
      `;

      filteredRides.forEach(ride => {
        html += `<tr>
          <td><img src="../imagenes/user-icon.png" class="user-icon" alt="User Icon"> ${getUserNameFromEmail(ride.userEmail)}</td>
          <td><a href="#">${ride.origin}</a></td>
          <td>${ride.destination}</td>
          <td>${ride.seats}</td>
          <td>${ride.vehicle.marcas} ${ride.vehicle.model} ${ride.vehicle.year}</td>
          <td>$${parseFloat(ride.fee).toFixed(2)}</td>
          <td>
            <a href="details.html?rideIndex=${rides.indexOf(ride)}">Details</a> | 
            <a href="details.html?rideIndex=${rides.indexOf(ride)}">Request</a>
          </td>
        </tr>`;
      });

      html += '</tbody></table>';
    }

    resultsDiv.innerHTML = html;
  });
}

function getUserNameFromEmail(email) {
  if (!email) return 'Unknown';
  return email.split('@')[0];
}
