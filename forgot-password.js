const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");

const phoneInput = document.getElementById("phone");
const otpInput = document.getElementById("otp");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const resendOtpBtn = document.getElementById("resendOtpBtn");
const resetPasswordBtn = document.getElementById("resetPasswordBtn");

let phoneNumber = "";

// ===========================
// SEND OTP
// ===========================

sendOtpBtn.addEventListener("click", async () => {

    phoneNumber = phoneInput.value.trim();

    if (phoneNumber.length !== 10) {
        alert("Enter a valid 10-digit mobile number.");
        return;
    }

    phoneNumber = "+91" + phoneNumber;

    try {

        const response = await fetch(
            "https://labourlink-2v5e.onrender.com/forgot-password/send-otp",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phoneNumber: phoneNumber
                })
            }
        );

        const message = await response.text();

        alert(message);

        if (response.ok) {

            step1.classList.add("hidden");
            step2.classList.remove("hidden");
            document.getElementById("bar2").classList.add("active");

        }

    } catch (err) {

        console.error(err);
        alert("Unable to connect to server.");

    }

});

// ===========================
// VERIFY OTP
// ===========================

verifyOtpBtn.addEventListener("click", async () => {

    const otp = otpInput.value.trim();

    if (otp.length !== 6) {

        alert("Enter a valid OTP.");
        return;

    }

    try {

        const response = await fetch(
            "https://labourlink-2v5e.onrender.com/forgot-password/verify-otp",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phoneNumber: phoneNumber,
                    otp: otp
                })
            }
        );

        const message = await response.text();

        alert(message);

        if (response.ok) {

            step2.classList.add("hidden");
            step3.classList.remove("hidden");
            document.getElementById("bar3").classList.add("active");

        }

    } catch (err) {

        console.error(err);
        alert("Unable to connect to server.");

    }

});

// ===========================
// RESEND OTP
// ===========================

resendOtpBtn.addEventListener("click", async () => {

    try {

        const response = await fetch(
            "https://labourlink-2v5e.onrender.com/forgot-password/send-otp",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phoneNumber: phoneNumber
                })
            }
        );

        const message = await response.text();

        alert(message);

    } catch (err) {

        console.error(err);
        alert("Unable to connect to server.");

    }

});

// ===========================
// RESET PASSWORD
// ===========================

resetPasswordBtn.addEventListener("click", async () => {

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (newPassword.length < 6) {

        alert("Password must contain at least 6 characters.");
        return;

    }

    if (newPassword !== confirmPassword) {

        alert("Passwords do not match.");
        return;

    }

    try {

        const response = await fetch(
            "https://labourlink-2v5e.onrender.com/forgot-password/reset-password",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phoneNumber: phoneNumber,
                    newPassword: newPassword
                })
            }
        );

        const message = await response.text();

        alert(message);

        if (response.ok) {

            alert("Password reset successful.");

            window.location.href = "login.html";

        }

    } catch (err) {

        console.error(err);
        alert("Unable to connect to server.");

    }

});