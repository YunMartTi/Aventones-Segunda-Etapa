document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const rideIndex = params.get('rideIndex');

  const rides = JSON.parse(localStorage.getItem('rides')) || [];
  const ride = rides[rideIndex];

  if (!ride) {
    alert('Ride not found.');
    window.location.href = 'home.html';
    return;
  }

  // ✅ Manejar el botón Request
  document.getElementById('requestRideBtn').addEventListener('click', () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
      alert('Please log in before requesting a ride.');
      window.location.href = '../index.html';
      return;
    }

    // Objeto de solicitud
    const newRequest = {
      rideIndex: parseInt(rideIndex, 10), // referencia al ride
      rideOwner: ride.userEmail,          // dueño del ride
      requesterEmail: loggedInUser.email, // usuario que pide
      from: ride.origin,
      to: ride.destination,
      status: "pendiente",                // estado inicial
      createdAt: new Date().toISOString()
    };

    // Guardar en localStorage
    const requests = JSON.parse(localStorage.getItem('rideRequests')) || [];
    requests.push(newRequest);
    localStorage.setItem('rideRequests', JSON.stringify(requests));

    alert('Your request has been sent! Status: pendiente');
    window.location.href = "booking.html"; // redirige a la lista de bookings
  });
});
