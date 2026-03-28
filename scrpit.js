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

// ==================== DATES MODAL ====================
function showDatesModal() {
    document.getElementById('dates-modal').classList.remove('hidden');
}

function hideDatesModal() {
    document.getElementById('dates-modal').classList.add('hidden');
}

// ==================== CONTACT FORM ====================
function handleContact(e) {
    e.preventDefault();
    const name = document.getElementById('name').value || "Parent";
    alert(`Thank you, ${name}! / እናመሰግናለን, ${name}!\n\nYour message has been received.`);
    e.target.reset();
}