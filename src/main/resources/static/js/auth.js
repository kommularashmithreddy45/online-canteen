const API_BASE = window.location.origin.includes(":8080") 
    ? `${window.location.origin}/api` 
    : "http://localhost:8080/api";

// Fallback demo users if Spring Boot is not yet running
const DEMO_USERS = [
    { collegeId: "21CS101", password: "1234", fullName: "Aarav Sharma", role: "STUDENT" },
    { collegeId: "21CS102", password: "1234", fullName: "Priya Patel", role: "STUDENT" },
    { collegeId: "OWNER01", password: "admin123", fullName: "Chef Ramesh (Canteen Manager)", role: "OWNER" }
];

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const loginSubmitBtn = document.getElementById("loginSubmitBtn");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        loginError.style.display = "none";
        loginSubmitBtn.innerText = "Verifying...";

        const collegeId = document.getElementById("collegeId").value.trim().toUpperCase();
        const password = document.getElementById("password").value;

        try {
            // First attempt: Connect to live Spring Boot backend
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 sec timeout

            const response = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ collegeId, password }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await response.json();

            if (response.ok && data.success) {
                data.mode = "LIVE_BACKEND";
                localStorage.setItem("canteen_user", JSON.stringify(data));
                redirectUser(data.role);
                return;
            } else {
                showError(data.message || "Invalid College ID or Password");
                return;
            }
        } catch (backendErr) {
            console.log("Spring Boot backend offline, falling back to instant Demo Mode");
            // Backend offline fallback: check demo users
            const matchedUser = DEMO_USERS.find(
                u => u.collegeId === collegeId && u.password === password
            );

            if (matchedUser) {
                const sessionData = {
                    success: true,
                    message: "Login successful (Demo Mode)",
                    collegeId: matchedUser.collegeId,
                    fullName: matchedUser.fullName,
                    role: matchedUser.role,
                    mode: "DEMO_MODE"
                };
                localStorage.setItem("canteen_user", JSON.stringify(sessionData));
                redirectUser(matchedUser.role);
            } else {
                showError("Invalid College ID or Password. Try 21CS101 / 1234 or OWNER01 / admin123");
            }
        }
    });
}

function redirectUser(role) {
    if (role === "OWNER") {
        window.location.href = "owner.html";
    } else {
        window.location.href = "student.html";
    }
}

function showError(msg) {
    loginError.innerText = msg;
    loginError.style.display = "block";
    loginSubmitBtn.innerText = "Continue ➔";
}

function getUser() {
    const userStr = localStorage.getItem("canteen_user");
    return userStr ? JSON.parse(userStr) : null;
}

function logout() {
    localStorage.removeItem("canteen_user");
    window.location.href = "index.html";
}
