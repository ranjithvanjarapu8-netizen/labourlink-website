// ================= AUTH CHECK =================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// ================= FIND WORK =================

async function findWork() {

    try {

        const response = await fetch("https://labourlink-2v5e.onrender.com/api/worker/me", {

            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        if (response.status === 404) {

            window.location.href = "worker-register.html";
            return;
        }

        if (response.ok) {

            const worker = await response.json();

            localStorage.setItem("worker", JSON.stringify(worker));

            window.location.href = "worker-profile.html";

        } else {

            alert("Unable to load worker profile.");

        }

    } catch (error) {

        console.error(error);

        alert("Server error.");

    }

}

// ================= FIND WORKERS =================

function findWorkers() {

    window.location.href = "hire-requirements.html";

}

// ================= PROFILE DROPDOWN =================

const profileBtn = document.querySelector(".profile-btn");
const dropdown = document.querySelector(".dropdown");

profileBtn.addEventListener("click", function (e) {

    e.stopPropagation();

    dropdown.classList.toggle("show");

});

document.addEventListener("click", function () {

    dropdown.classList.remove("show");

});

dropdown.addEventListener("click", function (e) {

    e.stopPropagation();

});

// ================= LOGOUT =================

document.getElementById("logoutBtn").addEventListener("click", () => {

    if (confirm("Do you want to logout?")) {

        localStorage.removeItem("token");

        window.location.href = "login.html";

    }

});