const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const workerList = document.getElementById("workerList");

// ===========================
// Read Search Requirements
// ===========================

const professionName = sessionStorage.getItem("professionName");
const workDate = sessionStorage.getItem("workDate");
const workAddress = sessionStorage.getItem("searchedAddress");
const latitude = sessionStorage.getItem("searchedLatitude");
const longitude = sessionStorage.getItem("searchedLongitude");

// ===========================
// Show Search Summary
// ===========================

document.getElementById("selectedProfession").textContent =
    professionName || "-";

document.getElementById("selectedDate").textContent =
    workDate || "-";

document.getElementById("selectedLocation").textContent =
    workAddress || "-";

// ===========================
// Load Workers
// ===========================

loadNearbyWorkers();

async function loadNearbyWorkers() {

    if (!latitude || !longitude || !workDate) {

        alert("Search requirements not found.");

        window.location.href = "hire-requirements.html";

        return;

    }

    try {

        let url =
            `https://labourlink-2v5e.onrender.com/api/worker/nearby?lat=${latitude}&lon=${longitude}&date=${encodeURIComponent(workDate)}`;

        if (professionName) {

            url += `&profession=${encodeURIComponent(professionName)}`;

        }

        console.log("Request URL:", url);

        const response = await fetch(url, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        if (!response.ok) {

            const errorText = await response.text();

            console.error("Backend Error:", errorText);

            throw new Error(`Server returned ${response.status}`);

        }

        const workers = await response.json();

        displayWorkers(workers);

    }
    catch (error) {

        console.error(error);

        alert("Unable to load workers.");

    }

}

// ===========================
// Display Workers
// ===========================

function displayWorkers(workers) {

    workerList.innerHTML = "";

    if (!workers || workers.length === 0) {

        workerList.innerHTML =
            "<h2>No workers found for the selected requirements.</h2>";

        return;

    }

    workers.forEach(worker => {

        const image = worker.profilePhoto && worker.profilePhoto.trim() !== ""
            ? worker.profilePhoto
            : "https://res.cloudinary.com/mrjpk64t/image/upload/v1783926656/default_worker.jpg";
        workerList.innerHTML += `

            <div class="worker-card">

                <div class="worker-image">

                    <img src="${image}" alt="Worker">

                </div>

                <div class="worker-info">

                    <div>

                        <h2>${worker.name}</h2>

                        <p><strong>Profession:</strong> ${worker.profession.join(", ")}</p>

                        <p><strong>Experience:</strong> ${worker.experience} Years</p>

                        <p><strong>Completed Jobs:</strong> ${worker.totalJobs}</p>

                        <p><strong>Distance:</strong> ${worker.distance.toFixed(1)} km</p>

                    </div>

                    <div class="bottom">

                        <span class="rating">

                            ⭐ ${worker.rating}

                        </span>

                        <button
                            class="view-btn"
                            onclick="viewProfile(${worker.workerId}, ${worker.distance})">

                            View Profile

                        </button>

                    </div>

                </div>

            </div>

        `;

    });

}

// ===========================
// View Profile
// ===========================

function viewProfile(workerId, distance) {

    sessionStorage.setItem("workerDistance", distance);

    window.location.href =
        `worker-profile-view.html?id=${workerId}`;

}

// ===========================
// Navigation
// ===========================

function goBack(fallbackPage) {

    if (window.history.length > 1) {

        window.history.back();

    } else {

        window.location.href = fallbackPage;

    }

}

function logout() {

    localStorage.removeItem("token");

    window.location.href = "login.html";

}

document.getElementById("ownerRequestsBtn").addEventListener("click", () => {

    window.location.href = "owner-requests.html";

});

document.getElementById("viewWagesBtn").addEventListener("click", () => {

    window.location.href = "wages.html";

});

document.getElementById("changeSearchBtn").addEventListener("click", () => {

    window.location.href = "hire-requirements.html";

});