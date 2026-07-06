const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const requestContainer = document.getElementById("requestContainer");
const emptyState = document.getElementById("emptyState");
const requestCount = document.getElementById("requestCount");

loadRequests();

/* ================= LOAD REQUESTS ================= */

async function loadRequests() {

    try {

        const response = await fetch(
            "https://labourlink-2v5e.onrender.com/api/work/incoming",
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        if (!response.ok) {
            throw new Error("Unable to load requests");
        }

        const requests = await response.json();

        displayRequests(requests);

    }
    catch (err) {

        console.error(err);

        requestContainer.innerHTML = "";

        emptyState.style.display = "block";

        emptyState.innerHTML = `
            <div class="empty-card">

                <i class="fa-solid fa-circle-exclamation"></i>

                <h2>Unable to load requests</h2>

                <p>Please try again later.</p>

            </div>
        `;

    }

}

/* ================= DISPLAY ================= */

function displayRequests(requests) {

    requestContainer.innerHTML = "";

    requestCount.textContent = requests.length;

    if (requests.length === 0) {

        emptyState.style.display = "block";

        requestContainer.style.display = "none";

        return;

    }

    emptyState.style.display = "none";

    requestContainer.style.display = "block";

    requests.forEach(request => {

        requestContainer.innerHTML += `

        <div class="request-card">

            <div class="request-left">

                <div class="card-title">

                    <i class="fa-solid fa-briefcase"></i>

                    <h2>${request.title}</h2>

                </div>

                <p>

                    <i class="fa-solid fa-user"></i>

                    <strong>Owner :</strong>

                    ${request.ownerName}

                </p>

                <p>

                    <i class="fa-solid fa-screwdriver-wrench"></i>

                    <strong>Profession :</strong>

                    ${request.profession}

                </p>

                <p>

                    <i class="fa-solid fa-calendar-days"></i>

                    <strong>Date :</strong>

                    ${formatDate(request.workDate)}

                </p>

                <p>

                    <i class="fa-solid fa-clock"></i>

                    <strong>Time :</strong>

                    ${formatTime(request.startTime)}
                    -
                    ${formatTime(request.endTime)}

                </p>

                <p>

                    <i class="fa-solid fa-location-dot"></i>

                    <strong>Distance :</strong>

                    ${request.distance.toFixed(1)} km

                </p>

            </div>

            <div class="request-right">

                <button
                    class="view-btn"
                    onclick="viewRequest(${request.requestId})">

                    <i class="fa-solid fa-eye"></i>

                    View Details

                </button>

            </div>

        </div>

        `;

    });

}

/* ================= VIEW DETAILS ================= */

function viewRequest(requestId) {

    window.location.href =
        `worker-request.html?id=${requestId}`;

}

/* ================= FORMAT DATE ================= */

function formatDate(date) {

    return new Date(date).toLocaleDateString("en-IN", {

        day: "numeric",

        month: "short",

        year: "numeric"

    });

}

/* ================= FORMAT TIME ================= */

function formatTime(time) {

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
