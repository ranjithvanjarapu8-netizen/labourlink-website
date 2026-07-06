const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const completedList = document.getElementById("completedList");
const emptyState = document.getElementById("emptyState");
const completedCount = document.getElementById("completedCount");

loadCompletedJobs();

/* ================= LOAD COMPLETED JOBS ================= */

async function loadCompletedJobs() {

    try {

        const response = await fetch(
            "https://labourlink-2v5e.onrender.com/api/work/completed",
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        if (!response.ok) {
            throw new Error("Unable to load completed jobs");
        }

        const jobs = await response.json();

        displayCompletedJobs(jobs);

    }
    catch (err) {

        console.error(err);

        completedList.innerHTML = "";

        emptyState.style.display = "block";

        emptyState.innerHTML = `

            <div class="empty-card">

                <i class="fa-solid fa-circle-exclamation"></i>

                <h2>Unable to load completed jobs</h2>

                <p>Please try again later.</p>

            </div>

        `;

    }

}

/* ================= DISPLAY COMPLETED JOBS ================= */

function displayCompletedJobs(jobs) {

    completedList.innerHTML = "";

    completedCount.textContent = jobs.length;

    if (jobs.length === 0) {

        completedList.style.display = "none";

        emptyState.style.display = "block";

        return;

    }

    completedList.style.display = "block";

    emptyState.style.display = "none";

    jobs.forEach(job => {

        completedList.innerHTML += `

        <div class="card">

            <h2>${job.title}</h2>

            <div class="row">

                <div class="label">Owner</div>

                <div class="value">${job.ownerName}</div>

            </div>

            <div class="row">

                <div class="label">Profession</div>

                <div class="value">${job.profession}</div>

            </div>

            <div class="row">

                <div class="label">Description</div>

                <div class="value">${job.description}</div>

            </div>

            <div class="row">

                <div class="label">Address</div>

                <div class="value">${job.address}</div>

            </div>

            <div class="row">

                <div class="label">Distance</div>

                <div class="value">${job.distance.toFixed(1)} km</div>

            </div>

            <div class="row">

                <div class="label">Work Date</div>

                <div class="value">${formatDate(job.workDate)}</div>

            </div>

            <div class="row">

                <div class="label">Time</div>

                <div class="value">

                    ${formatTime(job.startTime)}
                    -
                    ${formatTime(job.endTime)}

                </div>

            </div>

            <div class="bottom">

                <span class="status">

                    <i class="fa-solid fa-circle-check"></i>

                    COMPLETED

                </span>

            </div>

        </div>

        `;

    });

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