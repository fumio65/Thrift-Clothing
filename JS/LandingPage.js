// API Configuration
const API_BASE = 'http://localhost/thrift-clothing/api/';

// ============= Alert Message Handler =============

function showAlert(elementId, message, type = 'error') {
    const alertElement = document.getElementById(elementId);
    if (!alertElement) {
        console.error(`Alert element with id '${elementId}' not found`);
        return;
    }

    alertElement.textContent = message;
    alertElement.className = `alert-message show ${type}`;

    if (type === 'success') {
        setTimeout(() => {
            alertElement.classList.remove('show');
        }, 4000);
    }
}

function hideAlert(elementId) {
    const alertElement = document.getElementById(elementId);
    if (alertElement) {
        alertElement.classList.remove('show');
    }
}

function clearAlerts() {
    const loginAlert = document.getElementById('loginAlert');
    const signupAlert = document.getElementById('signupAlert');
    if (loginAlert) loginAlert.classList.remove('show');
    if (signupAlert) signupAlert.classList.remove('show');
}

// ============= Modal Functions =============

function showLanding() {
    document.getElementById('landingPage').classList.remove('hidden');
    closeModals();
}

function showLogin() {
    clearAlerts();
    document.getElementById('loginModal').classList.add('active');
}

function showSignup() {
    clearAlerts();
    document.getElementById('signupModal').classList.add('active');
}

function closeModals() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('signupModal').classList.remove('active');
    clearAlerts();
}

function switchToLogin() {
    document.getElementById('signupModal').classList.remove('active');
    setTimeout(() => showLogin(), 200);
}

function switchToSignup() {
    document.getElementById('loginModal').classList.remove('active');
    setTimeout(() => showSignup(), 200);
}

function showShop() {
    window.location.href = 'Home.html';
}

// ============= Authentication Functions =============

function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value.trim();
    const password = form.querySelector('input[type="password"]').value;
    
    hideAlert('loginAlert');

    if (!email || !password) {
        showAlert('loginAlert', '⚠️ Please fill in all fields', 'error');
        return;
    }

    // ========== NEWLY ADDED PASSWORD STRENGTH CHECK ==========
    if (password.length < 8) {
        showAlert('loginAlert', '⚠️ Password must be at least 8 characters long', 'error');
        return;
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
        showAlert(
            'loginAlert',
            '⚠️ Password must contain uppercase, lowercase, numbers, and special characters (!@#$%^&*)',
            'error'
        );
        return;
    }
    // ==========================================================

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';

    fetch(`${API_BASE}auth.php?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        if (data.success) {
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('userId', data.data.userId);
            localStorage.setItem('userName', `${data.data.firstName} ${data.data.lastName}`);
            localStorage.setItem('userEmail', data.data.email);
            
            showAlert('loginAlert', '✅ Login successful! Redirecting...', 'success');
            
            form.reset();
            
            setTimeout(() => {
                window.location.href = 'Home.html';
            }, 1500);
        } else {
            showAlert('loginAlert', '❌ ' + (data.message || 'Login failed. Please try again.'), 'error');
        }
    })
    .catch(error => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        console.error('Login error:', error);
        showAlert('loginAlert', '❌ Unable to connect to server. Make sure XAMPP is running.', 'error');
    });
}

function handleSignup(e) {
    e.preventDefault();
    
    const form = e.target;
    const fullName = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const password = form.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    hideAlert('signupAlert');

    if (!fullName || !email || !password || !confirmPassword) {
        showAlert('signupAlert', '⚠️ Please fill in all fields', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showAlert('signupAlert', '⚠️ Please agree to the Terms and Conditions', 'warning');
        return;
    }
    
    if (password.length < 8) {
        showAlert('signupAlert', '⚠️ Password must be at least 8 characters long', 'error');
        return;
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
        showAlert('signupAlert', '⚠️ Password must contain uppercase, lowercase, numbers, and special characters (!@#$%^&*)', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('signupAlert', '⚠️ Passwords do not match', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('signupAlert', '⚠️ Please enter a valid email address', 'error');
        return;
    }

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';

    fetch(`${API_BASE}auth.php?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
    })
    .then(response => response.json())
    .then(data => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        if (data.success) {
            showAlert('signupAlert', '✅ Account created successfully! Switching to login...', 'success');
            form.reset();
            setTimeout(() => switchToLogin(), 1500);
        } else {
            showAlert('signupAlert', '❌ ' + (data.message || 'Signup failed. Please try again.'), 'error');
        }
    })
    .catch(error => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        console.error('Signup error:', error);
        showAlert('signupAlert', '❌ Unable to connect to server. Make sure XAMPP is running.', 'error');
    });
}

// ============= Event Listeners =============

document.addEventListener('DOMContentLoaded', function() {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target.id === 'loginModal') closeModals();
        });
    }
    
    if (signupModal) {
        signupModal.addEventListener('click', (e) => {
            if (e.target.id === 'signupModal') closeModals();
        });
    }
});

// ============= Helper Functions =============

function isUserLoggedIn() {
    return localStorage.getItem('authToken') !== null;
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    
    showAlert('loginAlert', 'Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'LandingPage.html';
    }, 1500);
}

function getUserInfo() {
    return {
        token: localStorage.getItem('authToken'),
        userId: localStorage.getItem('userId'),
        name: localStorage.getItem('userName'),
        email: localStorage.getItem('userEmail')
    };
}
