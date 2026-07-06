let latitude = null;
let longitude = null;

const locationStatus = document.getElementById("locationStatus");
const photoInput = document.getElementById("profilePhoto");
const photoPreview = document.getElementById("photoPreview");
const professionContainer = document.getElementById("professionContainer");

// ===============================
// Load Professions
// ===============================

async function loadProfessions() {

    try {

        const response = await fetch(
            "https://labourlink-2v5e.onrender.com/api/profession/all"
        );

        const professions = await response.json();

        professionContainer.innerHTML = "";

        professions.forEach(profession => {

            professionContainer.innerHTML += `
                <label>
                    <input
                        type="checkbox"
                        name="profession"
                        value="${profession.id}">
                    ${profession.name}
                </label>
            `;

        });

    } catch (error) {

        console.error(error);

        professionContainer.innerHTML =
            "<p>Unable to load professions.</p>";

    }

}

// ===============================
// Preview Selected Image
// ===============================

photoInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const MAX_SIZE = 2 * 1024 * 1024;

    if (file.size > MAX_SIZE) {

        alert("Profile photo should be less than 2 MB.");

        this.value = "";
        photoPreview.src = "";

        return;

    }

    photoPreview.src = URL.createObjectURL(file);

});

// ===============================
// Get Current Location
// ===============================

window.onload = () => {

    loadProfessions();

    if (!navigator.geolocation) {

        locationStatus.innerHTML =
            "Geolocation is not supported.";

        return;

    }

    navigator.geolocation.getCurrentPosition(

        (position) => {

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            locationStatus.innerHTML =
                "✅ Location Captured Successfully";

        },

        (error) => {

            locationStatus.innerHTML =
                "❌ Please allow location access.";

            console.log(error);

        }

    );

};

// ===============================
// Register Worker
// ===============================

const form = document.getElementById("workerForm");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    if (latitude === null || longitude === null) {

        alert("Please allow location access.");
        return;

    }

    const image = photoInput.files[0];

    if (!image) {

        alert("Please select a profile photo.");
        return;

    }

    const MAX_SIZE = 2 * 1024 * 1024;

    if (image.size > MAX_SIZE) {

        alert("Profile photo should be less than 2 MB.");
        return;

    }

    // ===============================
    // Selected Profession IDs
    // ===============================

    const professionIds = [];

    document
        .querySelectorAll('input[name="profession"]:checked')
        .forEach((checkbox) => {

            professionIds.push(Number(checkbox.value));

        });

    if (professionIds.length === 0) {

        alert("Please select at least one profession.");
        return;

    }

    const workerData = {

        professionIds: professionIds,

        experience: parseInt(document.getElementById("experience").value),

        aadhaarNumber: document.getElementById("aadhaar").value,

        description: document.getElementById("description").value,

        languages: document.getElementById("languages").value,

        city: document.getElementById("city").value,

        district: document.getElementById("district").value,

        state: document.getElementById("state").value,

        available: document.getElementById("available").value === "true",

        latitude: latitude,

        longitude: longitude

    };

    const formData = new FormData();

    formData.append(
        "worker",
        new Blob(
            [JSON.stringify(workerData)],
            {
                type: "application/json"
            }
        )
    );

    formData.append("photo", image);

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(

            "https://labourlink-2v5e.onrender.com/api/worker/register",

            {

                method: "POST",

                headers: {

                    Authorization: "Bearer " + token

                },

                body: formData

            }

        );

        const message = await response.text();

        if (response.ok) {

            alert(message);

            window.location.href = "worker-home.html";

        } else {

            alert(message);

        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");

    }

});