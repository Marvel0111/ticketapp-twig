// Authentication logic for login and signup
function showToast(id, message, type = 'error') {
    const toast = document.getElementById(id);
    toast.textContent = message;
    toast.className = 'toast ' + type;
    toast.style.display = 'block';
    // Announce to screen readers via the global live region if present
    const live = document.getElementById('ariaLive');
    if (live) {
        live.textContent = message;
    }
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Login form handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let email = e.target.email.value.trim();
        let password = e.target.password.value;
        let valid = true;
        if (!validateEmail(email)) {
            document.getElementById('emailError').textContent = 'Invalid email.';
            valid = false;
        } else {
            document.getElementById('emailError').textContent = '';
        }
        if (!validatePassword(password)) {
            document.getElementById('passwordError').textContent = 'Password must be at least 6 characters.';
            valid = false;
        } else {
            document.getElementById('passwordError').textContent = '';
        }
        if (!valid) return;
        // Simulate authentication
        let users = JSON.parse(localStorage.getItem('ticketapp_users') || '[]');
        let user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('ticketapp_session', JSON.stringify({ email }));
            window.location.href = '/dashboard.php';
        } else {
            showToast('loginToast', 'Invalid credentials.');
        }
    });
}

// Signup form handler
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let email = e.target.email.value.trim();
        let password = e.target.password.value;
        let valid = true;
        if (!validateEmail(email)) {
            document.getElementById('emailError').textContent = 'Invalid email.';
            valid = false;
        } else {
            document.getElementById('emailError').textContent = '';
        }
        if (!validatePassword(password)) {
            document.getElementById('passwordError').textContent = 'Password must be at least 6 characters.';
            valid = false;
        } else {
            document.getElementById('passwordError').textContent = '';
        }
        if (!valid) return;
        // Simulate user registration
        let users = JSON.parse(localStorage.getItem('ticketapp_users') || '[]');
        if (users.find(u => u.email === email)) {
            showToast('signupToast', 'Email already registered.');
            return;
        }
        users.push({ email, password });
        localStorage.setItem('ticketapp_users', JSON.stringify(users));
        showToast('signupToast', 'Signup successful!', 'success');
        setTimeout(() => { window.location.href = '/auth/login.php'; }, 1200);
    });
}

// Improve accessibility: focus first input on page load for auth forms
document.addEventListener('DOMContentLoaded', function(){
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const first = loginForm.querySelector('input[autofocus]') || loginForm.querySelector('input');
        if (first) first.focus();
    }
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        const first = signupForm.querySelector('input[autofocus]') || signupForm.querySelector('input');
        if (first) first.focus();
    }
    // show any redirect message set by app (e.g., session expired)
    try {
        const msg = localStorage.getItem('ticketapp_message');
        if (msg) {
            const toastId = document.getElementById('loginForm') ? 'loginToast' : (document.getElementById('signupForm') ? 'signupToast' : 'loginToast');
            showToast(toastId, msg, 'error');
            localStorage.removeItem('ticketapp_message');
        }
    } catch(e) {}
});
