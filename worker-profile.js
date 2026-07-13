const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

loadWorkerProfile();

// ===============================
// LOAD PROFILE
// ===============================

async function loadWorkerProfile() {

    try {

        const response = await fetch(
            "https://labourlink-2v5e.onrender.com/api/worker/me",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {

            throw new Error("Unable to load profile.");

        }

        const worker = await response.json();

        displayProfile(worker);

    }

    catch (error) {

        console.error(error);

        alert("Unable to load profile.");

    }

}

// ===============================
// DISPLAY PROFILE
// ===============================

function displayProfile(worker) {

    // ===============================
    // Basic Information
    // ===============================

    document.getElementById("workerName").textContent =
        worker.name || "Worker";

    document.getElementById("phone").textContent =
        worker.phoneNumber || "-";

    document.getElementById("rating").textContent =
        worker.rating ?? "0.0";

    document.getElementById("totalJobs").textContent =
        worker.totalJobs ?? "0";

    document.getElementById("experience").textContent =
        worker.experience ?? "0";

    document.getElementById("languages").textContent =
        worker.languages || "Not Provided";

    document.getElementById("description").textContent =
        worker.description || "No description available.";

    // ===============================
    // Professions
    // ===============================

    const professions = worker.professions || [];

    document.getElementById("professions").textContent =
        professions.length > 0
            ? professions.join(" • ")
            : "Not Added";

    // ===============================
    // Skills
    // ===============================

    const skillsContainer =
        document.getElementById("skillsContainer");

    skillsContainer.innerHTML = "";

    professions.forEach(skill => {

        const span = document.createElement("span");

        span.className = "skill";

        span.textContent = skill;

        skillsContainer.appendChild(span);

    });

    // ===============================
    // Location
    // ===============================

    document.getElementById("city").textContent =
        worker.city || "-";

    document.getElementById("district").textContent =
        worker.district || "-";

    document.getElementById("state").textContent =
        worker.state || "-";

    // ===============================
    // Joined Date
    // ===============================

    document.getElementById("createdAt").textContent =
        formatDate(worker.createdAt);

    // ===============================
    // Profile Photo
    // ===============================

    const image = document.getElementById("profilePhoto");

    if (worker.profilePhoto && worker.profilePhoto.trim() !== "") {

        image.src = worker.profilePhoto;

    } else {

        image.src = "https://res.cloudinary.com/mrjpk64t/image/upload/v1783926656/default_worker.jpg";

    }

}

// ===============================
// DATE FORMAT
// ===============================

function formatDate(date) {

    if (!date) {

        return "-";

    }

    return new Date(date).toLocaleDateString(

        "en-IN",

        {

            day: "numeric",

            month: "long",

            year: "numeric"

        }

    );

}

// ===============================
// NAVIGATION
// ===============================

function goBack() {

    window.location.href = "home.html";

}

// ===============================
// LOGOUT
// ===============================

document.getElementById("logoutBtn").addEventListener("click", () => {

    if (!confirm("Are you sure you want to logout?")) {

        return;

    }

    localStorage.removeItem("token");

    window.location.href = "login.html";

});

// ===============================
// QUICK ACTIONS
// ===============================

document.getElementById("editProfileBtn").addEventListener("click", () => {

    window.location.href = "worker-edit-profile.html";

});
const wageBtn =
    document.getElementById("AcceptedBtn");

if (wageBtn) {

    wageBtn.addEventListener("click", () => {

        window.location.href = "worker-accepted.html";

    });

}

document.getElementById("requestsBtn").addEventListener("click", () => {

    window.location.href = "worker-dashboard.html";

});

document.getElementById("completedBtn").addEventListener("click", () => {

    window.location.href = "worker-completed.html";

});