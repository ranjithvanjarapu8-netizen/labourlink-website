const form = document.getElementById("registerForm");

const otpPopup = document.getElementById("otpPopup");

const verifyOtpBtn = document.getElementById("verifyOtpBtn");

const resendOtp = document.getElementById("resendOtp");

const loginBtn = document.getElementById("loginBtn");

let registrationData = {};

// -------------------------
// Register Button
// -------------------------

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    let phoneNumber = document.getElementById("phone").value.trim();

    const password = document.getElementById("password").value;

    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    // Convert to +91 format
    if (!phoneNumber.startsWith("+91")) {
        phoneNumber = "+91" + phoneNumber;
    }

    registrationData = {
        name: name,
        phoneNumber: phoneNumber,
        password: password
    };

    try {

        const response = await fetch("https://labourlink-2v5e.onrender.com/otp/send-otp", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                phoneNumber: phoneNumber
            })

        });

        const message = await response.text();

        if (response.ok) {

            document.getElementById("otpText").innerText =
                "OTP sent to " + phoneNumber;

            otpPopup.style.display = "flex";

        } else {

            alert(message);

        }

    }

    catch (err) {

        alert("Unable to send OTP.");

        console.log(err);

    }

});

// -------------------------
// Verify OTP
// -------------------------

verifyOtpBtn.addEventListener("click", async function () {

    const otp = document.getElementById("otp").value.trim();

    if (otp.length != 6) {

        alert("Enter a valid OTP");

        return;

    }

    try {

        const response = await fetch("https://labourlink-2v5e.onrender.com/otp/verify-otp", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name: registrationData.name,

                phoneNumber: registrationData.phoneNumber,

                password: registrationData.password,

                otp: otp

            })

        });

        const message = await response.text();

        if (response.ok) {

            alert(message);

            otpPopup.style.display = "none";

            window.location.href = "login.html";

        }

        else {

            alert(message);

        }

    }

    catch (err) {

        alert("Verification Failed");

        console.log(err);

    }

});

// -------------------------
// Resend OTP
// -------------------------

resendOtp.addEventListener("click", async function () {

    try {

        const response = await fetch("https://labourlink-2v5e.onrender.com/otp/send-otp", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                phoneNumber: registrationData.phoneNumber

            })

        });

        const message = await response.text();

        alert(message);

    }

    catch (err) {

        alert("Unable to resend OTP");

    }

});

// -------------------------
// Login Button
// -------------------------

loginBtn.addEventListener("click", function () {

    window.location.href = "login.html";

});