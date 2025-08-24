document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("Please log in first.");
        window.location.href = "../index.html";
        return;
    }

    const rides = JSON.parse(localStorage.getItem("rides")) || [];
    const requests = JSON.parse(localStorage.getItem("rideRequests")) || [];

    // Filtrar solo solicitudes donde el conductor es el usuario actual o el requester es el usuario
    const myRequests = requests.filter(r =>
        r.rideOwner === loggedInUser.email || r.requesterEmail === loggedInUser.email
    );

    const tableBody = document.getElementById("bookingsTableBody");
    tableBody.innerHTML = "";

    if (myRequests.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="3">No bookings found.</td>
            </tr>
        `;
        return;
    }

    myRequests.forEach((req, index) => {
        // Buscar ride seguro usando rideOwner + from + to
        const ride = rides.find(r =>
            r.userEmail === req.rideOwner &&
            r.origin === req.from &&
            r.destination === req.to
        );

        const rideInfo = ride ? `${ride.origin} - ${ride.destination}` : `${req.from} - ${req.to}`;

        const row = document.createElement("tr");

        if (loggedInUser.role === "driver") {
            if (req.status === "pendiente") {
                row.innerHTML = `
                    <td>${req.requesterEmail}</td>
                    <td>${rideInfo}</td>
                    <td>
                        <button class="accept-btn" data-index="${index}">Accept</button> |
                        <button class="reject-btn" data-index="${index}">Reject</button>
                    </td>
                `;
            } else {
                row.innerHTML = `
                    <td>${req.requesterEmail}</td>
                    <td>${rideInfo}</td>
                    <td>${req.status}</td>
                `;
            }
        } else {
            row.innerHTML = `
                <td>${req.requesterEmail}</td>
                <td>${rideInfo}</td>
                <td>${req.status}</td>
            `;
        }

        tableBody.appendChild(row);
    });

    // Event delegation para Accept / Reject
    tableBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("accept-btn") || e.target.classList.contains("reject-btn")) {
            const idx = e.target.dataset.index;
            const status = e.target.classList.contains("accept-btn") ? "aceptado" : "rechazado";

            const myReq = myRequests[idx];
            const reqIndex = requests.findIndex(r =>
                r.rideIndex === myReq.rideIndex &&
                r.requesterEmail === myReq.requesterEmail &&
                r.rideOwner === myReq.rideOwner
            );

            if (reqIndex !== -1) {
                requests[reqIndex].status = status;
                localStorage.setItem("rideRequests", JSON.stringify(requests));
                alert(`Booking ${status}!`);
                location.reload();
            }
        }
    });
});
