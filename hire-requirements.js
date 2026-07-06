const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// ================= Elements =================

const professionSelect = document.getElementById("profession");
const workDateInput = document.getElementById("workDate");
const locationInput = document.getElementById("locationSearch");
const searchBtn = document.getElementById("searchBtn");
const continueBtn = document.getElementById("continueBtn");
const selectedLocation = document.getElementById("selectedLocation");

// ================= Default Date =================

const today = new Date().toISOString().split("T")[0];
workDateInput.min = today;
workDateInput.value = today;

// ================= Map =================

const map = L.map("map").setView([20.5937, 78.9629], 5);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap Contributors"
    }
).addTo(map);

let marker = null;

let latitude = null;
let longitude = null;
let address = "";

// ================= Load Professions =================

loadProfessions();

async function loadProfessions() {

    try {

        const response = await fetch(
            "https://labourlink-2v5e.onrender.com/api/profession/all",
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        if (!response.ok) {
            throw new Error("Unable to load professions.");
        }

        const professions = await response.json();

        professions.forEach(profession => {

            professionSelect.innerHTML += `
                <option value="${profession.id}">
                    ${profession.name}
                </option>
            `;

        });

    }
    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// ================= Search Location =================

searchBtn.addEventListener("click", searchLocation);

locationInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        e.preventDefault();

        searchLocation();

    }

});

async function searchLocation() {

    const location = locationInput.value.trim();

    if (location === "") {

        alert("Please enter a location.");

        return;

    }

    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
        );

        const data = await response.json();

        if (data.length === 0) {

            alert("Location not found.");

            return;

        }

        latitude = parseFloat(data[0].lat);
        longitude = parseFloat(data[0].lon);
        address = data[0].display_name;

        selectedLocation.textContent = address;

        map.setView([latitude, longitude], 15);

        if (marker) {
            map.removeLayer(marker);
        }

        marker = L.marker([latitude, longitude]).addTo(map);

    }
    catch (error) {

        console.error(error);

        alert("Unable to search location.");

    }

}

// ================= Select From Map =================

map.on("click", async function (e) {

    latitude = e.latlng.lat;
    longitude = e.latlng.lng;

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([latitude, longitude]).addTo(map);

    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        const data = await response.json();

        address = data.display_name || "";

        selectedLocation.textContent = address;

        locationInput.value = address;

    }
    catch (error) {

        console.error(error);

        address = `Lat: ${latitude}, Lon: ${longitude}`;

        selectedLocation.textContent = address;

    }

});

// ================= Continue =================

continueBtn.addEventListener("click", () => {

    const professionId = professionSelect.value;

    const professionName =
        professionSelect.options[
            professionSelect.selectedIndex
        ].text;

    const workDate = workDateInput.value;

    if (!professionId) {

        alert("Please select a profession.");

        return;

    }

    if (!workDate) {

        alert("Please select a work date.");

        return;

    }

    if (latitude === null || longitude === null) {

        alert("Please select a work location.");

        return;

    }

    sessionStorage.setItem("professionId", professionId);
    sessionStorage.setItem("professionName", professionName);

    sessionStorage.setItem("workDate", workDate);

    sessionStorage.setItem("searchedAddress", address);
    sessionStorage.setItem("searchedLatitude", latitude);
    sessionStorage.setItem("searchedLongitude", longitude);

    window.location.href = "find-workers.html";

});

// ================= Back =================
function goBack(fallbackPage) {

    if (window.history.length > 1) {

        window.history.back();

    } else {

        window.location.href = fallbackPage;

    }

}