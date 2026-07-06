const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const profession = new URLSearchParams(window.location.search)
    .get("profession");

if (!profession) {
    alert("Profession not selected.");
    window.location.href = "find-workers.html";
}

document.querySelector(".back-btn").addEventListener("click", () => {
    history.back();
});

loadServices();

async function loadServices() {

    try {

        const response = await fetch(
            `https://labourlink-2v5e.onrender.com/api/wages/${encodeURIComponent(profession)}`,
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        if (!response.ok) {
            throw new Error("Unable to load services.");
        }

        const services = await response.json();

        displayServices(services);

    } catch (error) {

        console.error(error);

        alert("Unable to load services.");

    }

}

function displayServices(services) {

    const container = document.getElementById("servicesContainer");

    container.innerHTML = "";

    if (services.length === 0) {

        document.getElementById("professionName").textContent = profession;

        document.getElementById("dailyWage").textContent = "Not Available";

        document.getElementById("totalServices").textContent = "0";

        container.innerHTML = `
            <div class="service-card">
                <h3>No Services Found</h3>
                <p>No services available for this profession.</p>
            </div>
        `;

        return;

    }

    /* ================= HEADER ================= */

    /* ================= HEADER ================= */

    document.getElementById("professionName").textContent =
        profession;

    document.getElementById("professionIcon").textContent =
        getProfessionIcon(profession);

    document.querySelector(".profession-desc").textContent =
        "Services available for this profession.";

    document.getElementById("dailyWage").textContent =
        "Not Available";

    document.getElementById("totalServices").textContent =
        services.length;

    /* ================= SERVICES ================= */

    services.forEach(service => {

        const card = document.createElement("div");

        card.className = "service-card";

        card.innerHTML = `

            <div class="service-top">

                <h3>${service.name}</h3>

                <span class="price">

                    ₹${service.price}

                </span>

            </div>

            <div class="service-middle">

                <span>

                    <i class="fa-regular fa-clock"></i>

                    ${service.estimatedHours} Hour${service.estimatedHours > 1 ? "s" : ""}

                </span>

            </div>

            <p>

                ${service.description}

            </p>

        `;

        container.appendChild(card);

    });

}

/* ================= ICONS ================= */

function getProfessionIcon(profession) {

    const p = profession.toLowerCase();

    if (p.includes("electric")) return "⚡";
    if (p.includes("plumb")) return "🚰";
    if (p.includes("paint")) return "🎨";
    if (p.includes("carpenter")) return "🪚";
    if (p.includes("mason")) return "🧱";
    if (p.includes("welder")) return "🔥";
    if (p.includes("mechanic")) return "🔧";
    if (p.includes("tile")) return "🧱";
    if (p.includes("ac")) return "❄️";
    if (p.includes("clean")) return "🧹";
    if (p.includes("gard")) return "🌿";

    return "👷";
}