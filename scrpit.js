// ==================== LANGUAGE SWITCH ====================
function switchLanguage(lang) {
    document.documentElement.className = `lang-${lang}`;
    localStorage.setItem('preferredLang', lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('bg-emerald-600', 'text-white');
        } else {
            btn.classList.remove('bg-emerald-600', 'text-white');
        }
    });
}

// Load saved language
const savedLang = localStorage.getItem('preferredLang') || 'en';
switchLanguage(savedLang);

// ==================== GOOGLE APPS SCRIPT URL ====================
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxYw3EHW6e4ab5zZ0J_qFRRV6JXv-LS1Rh16B_UN-DbqHYT3A3l11Jg4Ck1pGR0Go4FCw/exec";

// ==================== LOGIN MODAL ====================
function showLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
}

function hideLoginModal() {
    document.getElementById('login-modal').classList.add('hidden');
}

// ==================== LOGIN FUNCTION - CONNECTED TO GOOGLE SHEET ====================
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('login-id').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!username || !password) {
        alert("Please enter username and password / እባክዎ የተጠቃሚ ስም እና ሚስጥር ቃል ያስገቡ");
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = "Checking...";
    submitBtn.disabled = true;

    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: "login",
                username: username,
                password: password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (result.status === "success") {
            hideLoginModal();

            const role = (result.role || "Student").toLowerCase().trim();

            if (role === "teacher") {
                alert(`✅ Welcome, Teacher ${result.fullname || username}!`);
                window.location.href = "teacher-portal.html";
            } else {
                alert(`✅ Welcome back, ${result.fullname || username}!`);
                const hillsPage = document.getElementById('hills-page');
                if (hillsPage) {
                    hillsPage.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } else {
            alert("❌ Invalid username or password!\nPlease try again.");
        }
    } catch (error) {
        console.error(error);
        alert("❌ Connection failed.\nMake sure the Web App is deployed as 'Anyone' and try again.");
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// ==================== CONTACT FORM ====================
function handleContact(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
        alert("Please fill all required fields! / እባክዎ ሁሉንም የግዴታ መስኮች ይሙሉ!");
        return;
    }

    const scriptURL = "https://script.google.com/macros/s/AKfycbwA3lb6eKJniiegy6aEt_Mtc1pqhKSi8FGhdus4QWYdDKP2Sa4kP47yq5U_OtNmMRF2UA/exec";

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('message', message);

    fetch(scriptURL, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert(`Thank you, ${name}! / እናመሰግናለን, ${name}!\n\nYour message has been received successfully.`);
            e.target.reset();
        } else {
            alert("Failed to send message. Please try again.");
        }
    })
    .catch(() => {
        alert("Connection error. Please check your internet and try again.");
    });
}

// Attach events when page loads
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContact);
    }
});