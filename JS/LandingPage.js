// API Configuration
const API_BASE = 'http://localhost/thrift-clothing/api/';

// ============= Modal Functions =============

function showLanding() {
    document.getElementById('landingPage').classList.remove('hidden');
    closeModals();
}

function showLogin() {
    document.getElementById('loginModal').classList.add('active');
}

function showSignup() {
    document.getElementById('signupModal').classList.add('active');
}

function closeModals() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('signupModal').classList.remove('active');
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
    
    // Validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';
    
    // Send login request to backend
    fetch(`${API_BASE}auth.php?action=login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        if (data.success) {
            // Store token and user info
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('userId', data.data.userId);
            localStorage.setItem('userName', `${data.data.firstName} ${data.data.lastName}`);
            localStorage.setItem('userEmail', data.data.email);
            
            alert('Login successful! 🎉');
            closeModals();
            
            // Reset form
            form.reset();
            
            // Redirect to shop after 1 second
            setTimeout(() => {
                window.location.href = 'Home.html';
            }, 1000);
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch(error => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        console.error('Login error:', error);
        alert('Error: Unable to connect to server. Make sure XAMPP is running.');
    });
}

function handleSignup(e) {
    e.preventDefault();
    
    const form = e.target;
    const fullName = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const password = form.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;
    
    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Split full name
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    
    // Send signup request to backend
    fetch(`${API_BASE}auth.php?action=register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        if (data.success) {
            alert('Account created successfully! 🎉\n\nPlease log in with your credentials.');
            
            // Reset form and close modal
            form.reset();
            closeModals();
            
            // Switch to login after a short delay
            setTimeout(() => showLogin(), 500);
        } else {
            alert('Signup failed: ' + data.message);
        }
    })
    .catch(error => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        console.error('Signup error:', error);
        alert('Error: Unable to connect to server. Make sure XAMPP is running.');
    });
}

// ============= Event Listeners =============

// Close modals when clicking outside
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
    
    alert('Logged out successfully');
    window.location.href = 'LandingPage.html';
}

function getUserInfo() {
    return {
        token: localStorage.getItem('authToken'),
        userId: localStorage.getItem('userId'),
        name: localStorage.getItem('userName'),
        email: localStorage.getItem('userEmail')
    };
}