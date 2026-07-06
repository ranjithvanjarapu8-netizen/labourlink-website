const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const requestsContainer = document.getElementById("requestsContainer");
const emptyState = document.getElementById("emptyState");

const totalCount = document.getElementById("totalCount");
const upcomingCount = document.getElementById("upcomingCount");
const pastCount = document.getElementById("pastCount");

const IMAGE_BASE_URL = "https://labourlink-2v5e.onrender.com/uploads/";

let allRequests = [];
let currentFilter = "ACCEPTED";

// ================= LOAD =================

loadRequests();

async function loadRequests() {

    try {

        const response = await fetch(
            "https://labourlink-2v5e.onrender.com/api/owner/requests",
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        if (!response.ok) {
            throw new Error("Unable to load requests");
        }

        const data = await response.json();

        const upcomingRequests = data.upcoming || [];
        const pastRequests = data.past || [];

        allRequests = [...upcomingRequests, ...pastRequests];

        totalCount.textContent = allRequests.length;
        upcomingCount.textContent = upcomingRequests.length;
        pastCount.textContent = pastRequests.length;

        applyFilter();

    } catch (err) {

        console.error(err);

        emptyState.style.display = "block";

        requestsContainer.innerHTML = "";

        emptyState.innerHTML = `
            <div class="empty-card">
                <i class="fa-solid fa-circle-exclamation"></i>
                <h2>Unable to load requests</h2>
                <p>Please try again later.</p>
            </div>
        `;
    }

}

// ================= FILTER =================

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        applyFilter();

    });

});

function applyFilter() {

    let filtered = allRequests;

    if (currentFilter !== "ALL") {

        filtered = allRequests.filter(request =>
            request.status === currentFilter
        );

    }

    renderRequests(filtered);

    if (filtered.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }

}

// ================= RENDER =================

function renderRequests(requests) {

    requestsContainer.innerHTML = "";

    if (requests.length === 0) {
        return;
    }

    requests.forEach(request => {

        const statusClass = request.status.toLowerCase();

        const image = request.profilePhoto
            ? IMAGE_BASE_URL + request.profilePhoto
            : "images/default-profile.png";

        let phone = "";

        if (request.status === "ACCEPTED") {

            phone = `
                <p class="phone">
                    <i class="fa-solid fa-phone"></i>
                    ${request.phoneNumber}
                </p>
            `;

        }

        requestsContainer.innerHTML += `

        <div class="request-card">

            <div class="worker-header">

                <img
                    src="${image}"
                    class="worker-photo">

                <div class="worker-info">

                    <h3>${request.workerName}</h3>

                    <p class="profession">
                        ${request.profession}
                    </p>

                </div>

            </div>

            <div class="request-details">

                <p>
                    <strong>Work :</strong>
                    ${request.title}
                </p>

                <p>
                    <strong>Date :</strong>
                    ${formatDate(request.workDate)}
                </p>

                <p>
                    <strong>Time :</strong>
                    ${formatTime(request.startTime)}
                    -
                    ${formatTime(request.endTime)}
                </p>

                <p>
                    <strong>Address :</strong>
                    ${request.address}
                </p>

                ${phone}

            </div>

            <span class="status ${statusClass}">
                ${request.status}
            </span>

        </div>

        `;

    });

}

// ================= DATE =================

function formatDate(date) {

    if (!date) return "-";

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}

// ================= TIME =================

function formatTime(time) {

    if (!time) return "-";

    const parts = time.split(":");

    let hour = parseInt(parts[0]);

    const minute = parts[1];

    const ampm = hour >= 12 ? "PM" : "AM";

    hour %= 12;

    if (hour === 0) {
        hour = 12;
    }

    return `${hour}:${minute} ${ampm}`;

}

// ================= LOGOUT =================

document
    .getElementById("logoutBtn")
    .addEventListener("click", function (e) {

        e.preventDefault();

        localStorage.removeItem("token");

        window.location.href = "login.html";

    });

    function goBack() {

    if (window.history.length > 1) {

        window.history.back();

    } else {

        window.location.href = "home.html";

    }

}