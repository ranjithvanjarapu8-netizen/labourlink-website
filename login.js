// If already logged in, go directly to home
const token = localStorage.getItem("token");

if (token) {
    window.location.href = "home.html";
}

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    let phoneNumber = document.getElementById("phone").value.trim();

    if (phoneNumber.length !== 10) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    phoneNumber = "+91" + phoneNumber;

    const data = {
        phoneNumber: phoneNumber,
        password: document.getElementById("password").value
    };

    try {

        const response = await fetch("https://labourlink-2v5e.onrender.com/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        if (response.ok) {

            localStorage.setItem("token", result.token);

            alert(result.message);

            window.location.href = "home.html";

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to server.");

    }

});

// Register button
document.getElementById("registerBtn").addEventListener("click", () => {

    window.location.href = "register.html";

});

// Optional: only needed if forgotPassword is NOT an <a> tag
const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword && forgotPassword.tagName !== "A") {

    forgotPassword.addEventListener("click", () => {

        window.location.href = "forgot-password.html";

    });

}