const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const requestId = new URLSearchParams(window.location.search).get("id");

if (!requestId) {

    alert("Invalid Request.");

    window.location.href = "worker-dashboard.html";

}

// ================= LOAD REQUEST =================

loadRequest();

async function loadRequest() {

    try {

        const response = await fetch(

            `https://labourlink-2v5e.onrender.com/api/work/details/${requestId}`,

            {

                headers: {

                    Authorization: "Bearer " + token

                }

            }

        );

        if (!response.ok) {

            throw new Error("Unable to load request.");

        }

        const request = await response.json();

        displayRequest(request);

    }

    catch (err) {

        console.error(err);

        alert("Unable to load request details.");

    }

}

// ================= DISPLAY =================

function displayRequest(request) {

    document.getElementById("title").textContent =
        request.title;

    document.getElementById("ownerName").textContent =
        request.ownerName;

    document.getElementById("ownerPhone").textContent =
        request.ownerPhone;

    document.getElementById("profession").textContent =
        request.profession;

    document.getElementById("distance").textContent =
        request.distance.toFixed(1) + " km";

    document.getElementById("workDate").textContent =
        formatDate(request.workDate);

    document.getElementById("workTime").textContent =
        formatTime(request.startTime)
        + " - "
        + formatTime(request.endTime);

    document.getElementById("description").textContent =
        request.description;

    document.getElementById("address").textContent =
        request.address;

    const status = document.getElementById("status");

    status.textContent = request.status;

    const actionButtons = document.getElementById("actionButtons");

    if (request.status === "PENDING") {

        actionButtons.style.display = "flex";

    } else {

        actionButtons.style.display = "none";

    }

}

// ================= ACCEPT =================

document.getElementById("acceptBtn")
.addEventListener("click", async () => {

    if (!confirm("Accept this work request?")) {

        return;

    }

    try {

        const response = await fetch(

            `https://labourlink-2v5e.onrender.com/api/work/accept/${requestId}`,

            {

                method: "PUT",

                headers: {

                    Authorization: "Bearer " + token

                }

            }

        );

        const message = await response.text();

        if (!response.ok) {

            throw new Error(message);

        }

        alert(message);

        window.location.href = "worker-dashboard.html";

    }

    catch (err) {

        console.error(err);

        alert("Unable to accept request.");

    }

});

// ================= REJECT =================

document.getElementById("rejectBtn")
.addEventListener("click", async () => {

    if (!confirm("Reject this work request?")) {

        return;

    }

    try {

        const response = await fetch(

            `https://labourlink-2v5e.onrender.com/api/work/reject/${requestId}`,

            {

                method: "PUT",

                headers: {

                    Authorization: "Bearer " + token

                }

            }

        );

        const message = await response.text();

        if (!response.ok) {

            throw new Error(message);

        }

        alert(message);

        window.location.href = "worker-dashboard.html";

    }

    catch (err) {

        console.error(err);

        alert("Unable to reject request.");

    }

});

// ================= BACK BUTTON =================

document.querySelector(".back-btn")
.addEventListener("click", () => {

    history.back();

});

// ================= DATE =================

function formatDate(date) {

    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {

        day: "numeric",

        month: "long",

        year: "numeric"

    });

}

// ================= TIME =================

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
function openAcceptedJobs() {
    window.location.href = "worker-accepted.html";
}