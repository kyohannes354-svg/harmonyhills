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

// ==================== LOGIN MODAL ====================
function showLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
}

function hideLoginModal() {
    document.getElementById('login-modal').classList.add('hidden');
}

function handleLogin(e) {
    e.preventDefault();
    alert("✅ Welcome! / እንኳን ደህና መጡ! (Demo)");
    hideLoginModal();
}

// ==================== CONTACT FORM - Connected to Google Sheet ====================
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

    const scriptURL = "https://script.google.com/macros/s/AKfycbzwUAPNL2Zv8IWKqfNE16vTRtrQECWjeFv8KXy_Qply8z6PSzTQ3jszxFlApNU1Jebp/exec";

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