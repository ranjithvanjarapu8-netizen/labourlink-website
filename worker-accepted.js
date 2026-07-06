const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const requestList = document.getElementById("requestList");
const emptyState = document.getElementById("emptyState");
const acceptedCount = document.getElementById("acceptedCount");

loadAcceptedRequests();

/* ================= LOAD ACCEPTED REQUESTS ================= */

async function loadAcceptedRequests() {

    try {

        const response = await fetch(
            "https://labourlink-2v5e.onrender.com/api/work/accepted",
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        if (!response.ok) {

            throw new Error("Unable to load accepted requests");

        }

        const requests = await response.json();

        displayAcceptedRequests(requests);

    }

    catch (err) {

        console.error(err);

        requestList.innerHTML = "";

        emptyState.style.display = "block";

        emptyState.innerHTML = `

            <div class="empty-card">

                <i class="fa-solid fa-circle-exclamation"></i>

                <h2>Unable to load accepted jobs</h2>

                <p>Please try again later.</p>

            </div>

        `;

    }

}

/* ================= DISPLAY ================= */

function displayAcceptedRequests(requests) {

    requestList.innerHTML = "";

    acceptedCount.textContent = requests.length;

    if (requests.length === 0) {

        requestList.style.display = "none";

        emptyState.style.display = "block";

        return;

    }

    requestList.style.display = "block";

    emptyState.style.display = "none";

    requests.forEach(request => {

        requestList.innerHTML += `

        <div class="card">

            <h2>${request.title}</h2>

            <div class="row">

                <div class="label">Owner</div>

                <div class="value">${request.ownerName}</div>

            </div>

            <div class="row">

                <div class="label">Phone</div>

                <div class="value">${request.ownerPhone}</div>

            </div>

            <div class="row">

                <div class="label">Profession</div>

                <div class="value">${request.profession}</div>

            </div>

            <div class="row">

                <div class="label">Description</div>

                <div class="value">${request.description}</div>

            </div>

            <div class="row">

                <div class="label">Address</div>

                <div class="value">${request.address}</div>

            </div>

            <div class="row">

                <div class="label">Distance</div>

                <div class="value">${request.distance.toFixed(1)} km</div>

            </div>

            <div class="row">

                <div class="label">Date</div>

                <div class="value">${formatDate(request.workDate)}</div>

            </div>

            <div class="row">

                <div class="label">Time</div>

                <div class="value">

                    ${formatTime(request.startTime)}
                    -
                    ${formatTime(request.endTime)}

                </div>

            </div>

            <div class="bottom">

                <span class="status">

                    <i class="fa-solid fa-circle-check"></i>

                    ${request.status}

                </span>

                <div class="actions">

                    <button
                        class="details"
                        onclick="viewDetails(${request.requestId})">

                        <i class="fa-solid fa-eye"></i>

                        View Details

                    </button>

                    <button
                        class="map"
                        onclick="openMap(${request.latitude}, ${request.longitude})">

                        <i class="fa-solid fa-location-dot"></i>

                        Open Map

                    </button>

                </div>

            </div>

        </div>

        `;

    });

}

/* ================= VIEW DETAILS ================= */

function viewDetails(id) {

    window.location.href = `worker-request.html?id=${id}`;

}

/* ================= OPEN MAP ================= */

function openMap(lat, lon) {

    window.open(
        `https://www.google.com/maps?q=${lat},${lon}`,
        "_blank"
    );

}

/* ================= DATE ================= */

function formatDate(date) {

    return new Date(date).toLocaleDateString("en-IN", {

        day: "numeric",

        month: "short",

        year: "numeric"

    });

}

/* ================= TIME ================= */

function formatTime(time) {

    if (!time) return "-";

    const parts = time.split(":");

    let hour = parseInt(parts[0]);

    const minute = parts[1];

    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    if (hour === 0) {

        hour = 12;

    }

    return `${hour}:${minute} ${ampm}`;

}

/* ================= LOGOUT ================= */

document.getElementById("logoutBtn")
.addEventListener("click", function (e) {

    e.preventDefault();

    localStorage.removeItem("token");

    window.location.href = "login.html";

});