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
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyFn8C9x45K8gJtOdMdMZC-9yX5A95_OQG-3C_NYTyR2TL46PT-xpxkQg9o9p4kB2mh/exec";

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

// ==================== PAYMENT FUNCTION - NOW SAVES TO GOOGLE SHEET ====================
async function processPayment() {
    const studentId = document.getElementById('student-id').value.trim();
    const amount = document.getElementById('amount').value;
    const purpose = document.getElementById('payment-for').value;

    if (!studentId || !amount || !purpose) {
        alert("Please fill in all fields / እባክዎ ሁሉንም ቦታዎች ይሙሉ");
        return;
    }

    const btn = document.querySelector('#payment button'); 
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;
    btn.disabled = true;

    try {
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "payment",
                studentId: studentId,
                amount: amount,
                purpose: purpose
            })
        });

        const result = await response.json();

        if (result.status === "success") {
            alert(`✅ Payment of ${amount} ETB for ${purpose} has been initiated successfully!\n\nThank you for choosing Harmony Hills Academy.\n\n( This is a demo - no real payment processed )`);
            // Clear form after success
            document.getElementById('student-id').value = '';
            document.getElementById('amount').value = '';
        } else {
            alert("❌ Failed to record payment. Please try again.");
        }
    } catch (error) {
        alert("❌ Connection error. Make sure the Web App is deployed correctly.");
        console.error(error);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
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

    const scriptURL = WEB_APP_URL;

    fetch(scriptURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: "contact",
            name: name,
            email: email,
            phone: phone,
            message: message
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === "success") {
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

// Mobile menu button
document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    alert("Mobile menu coming soon!");
});