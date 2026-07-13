const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const workerId = new URLSearchParams(window.location.search).get("id");

if (!workerId) {

    alert("Worker not found.");

    window.location.href = "find-workers.html";

}

let currentWorker = null;

document.querySelector(".back-btn").addEventListener("click", () => {
    history.back();
});

document.querySelector(".hire-btn").addEventListener("click", () => {
    openHireModal();
});

loadWorker();

// ========================================
// LOAD WORKER
// ========================================

async function loadWorker() {

    try {

        const response = await fetch(

            `https://labourlink-2v5e.onrender.com/api/worker/profile/${workerId}`,

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        if (!response.ok) {

            throw new Error("Unable to load worker profile.");

        }

        const worker = await response.json();

        currentWorker = worker;

        displayWorker(worker);

    }

    catch (error) {

        console.error(error);

        alert("Failed to load worker profile.");

    }

}

// ========================================
// DISPLAY WORKER
// ========================================

function displayWorker(worker) {

    document.getElementById("workerName").textContent =
        worker.name ?? "Unknown Worker";

    document.getElementById("rating").textContent =
        worker.rating ?? "0.0";

    document.getElementById("totalJobs").textContent =
        worker.totalJobs ?? "0";

    document.getElementById("experience").textContent =
        `${worker.experience ?? 0} Years`;

    document.getElementById("description").textContent =
        worker.description || "No description available.";

    document.getElementById("languages").textContent =
        worker.languages || "Not Provided";

    document.getElementById("joined").textContent =
        formatDate(worker.createdAt);

    document.getElementById("village").textContent =
        worker.city || "-";

    document.getElementById("district").textContent =
        worker.district || "-";

    document.getElementById("state").textContent =
        worker.state || "-";

    document.getElementById("availability").textContent =
        worker.available ? "Available" : "Busy";

    const savedDistance =
        sessionStorage.getItem("workerDistance");

    document.getElementById("distance").textContent =
        savedDistance
            ? `${Number(savedDistance).toFixed(1)} km`
            : "-";

    

    const image =
        document.getElementById("profilePhoto");
    if (worker.profilePhoto) {

        if (worker.profilePhoto.startsWith("http")) {
            image.src = worker.profilePhoto;
        } else {
            image.src =
                `https://labourlink-2v5e.onrender.com/uploads/workers/${worker.profilePhoto}`;
        }

    } else {

        image.src = "images/default-user.png";

    }

    const professions =
        worker.professions || [];

    document.getElementById("profession").textContent =
        professions.join(" • ");

    // ================= Skills =================

    const skillsContainer =
        document.getElementById("skillsContainer");

    skillsContainer.innerHTML = "";

    professions.forEach(skill => {

        const span =
            document.createElement("span");

        span.className = "skill";

        span.textContent = skill;

        skillsContainer.appendChild(span);

    });

    // ================= Pricing =================

    const pricingContainer =
        document.getElementById("pricingContainer");

    pricingContainer.innerHTML = "";

    professions.forEach(profession => {

        const link =
            document.createElement("a");

        link.className =
            "pricing-link";

        link.href =
            `profession-services.html?profession=${encodeURIComponent(profession)}`;

        link.innerHTML = `

            <span>

                ${getProfessionIcon(profession)}

                ${profession} Pricing

            </span>

            <i class="fa-solid fa-arrow-right"></i>

        `;

        pricingContainer.appendChild(link);

    });

}

// ========================================
// OPEN MODAL
// ========================================

async function openHireModal() {

    if (!currentWorker) return;

    document.getElementById("workerId").value =
        workerId;

    // -------- Booking Summary --------

    document.getElementById("summaryWorker").textContent =
        currentWorker.name;

    document.getElementById("summaryProfession").textContent =
        sessionStorage.getItem("professionName");

    document.getElementById("summaryDate").textContent =
        sessionStorage.getItem("workDate");

    document.getElementById("summaryLocation").textContent =
        sessionStorage.getItem("searchedAddress");

    // -------- Clear Form --------

    document.getElementById("jobTitle").value = "";

    document.getElementById("jobDescription").value = "";

    document.getElementById("startTime").value = "09:00";

    document.getElementById("endTime").value = "17:00";

    // -------- Load Work Types --------

    const profession =
        sessionStorage.getItem("professionName");

    const workType =
        document.getElementById("workType");

    workType.innerHTML =
        `<option value="">Loading...</option>`;

    try {

        const response = await fetch(

            `https://labourlink-2v5e.onrender.com/api/wages/${encodeURIComponent(profession)}`,

            {

                headers: {
                    Authorization: `Bearer ${token}`
                }

            }

        );

        if (!response.ok) {

            throw new Error();

        }

        const works =
            await response.json();

        workType.innerHTML =
            `<option value="">Select Work Type</option>`;

        works.forEach(work => {

            workType.innerHTML += `

                <option
                    value="${work.id}"
                    data-title="${work.name}">

                    ${work.name}
                    (₹${work.price})

                </option>

            `;

        });

        workType.onchange = function () {

            const option =
                this.options[this.selectedIndex];

            document.getElementById("jobTitle").value =
                option.dataset.title || "";

        };

    }

    catch (error) {

        console.error(error);

        workType.innerHTML =
            `<option value="">Unable to load work types</option>`;

    }

    document.getElementById("hireModal").style.display =
        "flex";

}

// ========================================
// CLOSE MODAL
// ========================================

function closeHireModal() {

    document.getElementById("hireModal").style.display = "none";

}

window.addEventListener("click", function (event) {

    const modal = document.getElementById("hireModal");

    if (event.target === modal) {

        closeHireModal();

    }

});

// ========================================
// SEND REQUEST
// ========================================

document
    .getElementById("hireForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const professionId =
            sessionStorage.getItem("professionId");

        const workDate =
            sessionStorage.getItem("workDate");

        const address =
            sessionStorage.getItem("searchedAddress");

        const latitude =
            sessionStorage.getItem("searchedLatitude");

        const longitude =
            sessionStorage.getItem("searchedLongitude");

        const request = {

            workerId: Number(workerId),

            professionId: Number(professionId),

            title:
                document.getElementById("jobTitle").value.trim(),

            description:
                document.getElementById("jobDescription").value.trim(),

            address: address,

            latitude: Number(latitude),

            longitude: Number(longitude),

            workDate: workDate,

            startTime:
                document.getElementById("startTime").value,

            endTime:
                document.getElementById("endTime").value

        };

        try {

            const response = await fetch(

                "https://labourlink-2v5e.onrender.com/api/work/send",

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json",

                        Authorization: `Bearer ${token}`

                    },

                    body: JSON.stringify(request)

                }

            );

            const message = await response.text();

            if (!response.ok) {

                throw new Error(message);

            }

            alert(message);

            closeHireModal();

        }

        catch (error) {

            console.error(error);

            alert(error.message);

        }

    });

// ========================================
// PROFESSION ICONS
// ========================================

function getProfessionIcon(profession) {

    const p = profession.toLowerCase();

    if (p.includes("electric")) return "⚡";

    if (p.includes("plumb")) return "🚰";

    if (p.includes("paint")) return "🎨";

    if (p.includes("mason")) return "🧱";

    if (p.includes("carpenter")) return "🪚";

    if (p.includes("welder")) return "🔥";

    if (p.includes("clean")) return "🧹";

    if (p.includes("gard")) return "🌿";

    if (p.includes("tile")) return "🧱";

    if (p.includes("mechanic")) return "🔧";

    if (p.includes("ac")) return "❄️";

    return "👷";

}

// ========================================
// DATE FORMAT
// ========================================

function formatDate(date) {

    if (!date) {

        return "N/A";

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