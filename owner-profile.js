const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// ================= LOAD PROFILE =================

loadOwnerProfile();

async function loadOwnerProfile() {

    try {

        const response = await fetch(
            "https://labourlink-2v5e.onrender.com/api/owner/profile",
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        if (!response.ok) {

            throw new Error("Unable to load profile.");

        }

        const owner = await response.json();

        displayProfile(owner);

    }

    catch (err) {

        console.error(err);

        alert("Unable to load profile.");

    }

}

// ================= DISPLAY PROFILE =================

function displayProfile(owner) {

    document.getElementById("ownerName").textContent =
        owner.name;

    document.getElementById("ownerPhone").textContent =
        owner.phoneNumber;

    document.getElementById("createdAt").textContent =
        formatDate(owner.joinedDate);

    // Show default image until profile photo feature is implemented
    document.getElementById("profileImage").src =
        "images/default-profile.png";

}

// ================= FORMAT DATE =================

function formatDate(date) {

    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {

        day: "numeric",

        month: "long",

        year: "numeric"

    });

}

// ================= EDIT PROFILE =================

document
.getElementById("editProfileBtn")
.addEventListener("click", () => {

    alert("Edit Profile feature coming soon.");

    // Later:
    // window.location.href = "owner-edit-profile.html";

});

// ================= LOGOUT =================

function logout() {

    if (!confirm("Are you sure you want to logout?")) {

        return;

    }

    localStorage.removeItem("token");

    window.location.href = "login.html";

}

document
.getElementById("logoutBtn")
.addEventListener("click", function (e) {

    e.preventDefault();

    logout();

});

document
.getElementById("logoutCard")
.addEventListener("click", logout);

// ================= BACK =================
// ================= BACK =================

function goBack() {

    if (window.history.length > 1) {

        window.location.href = "home.html";
    }
    

}
