// API Configuration
const API_BASE = 'http://localhost/thrift-clothing/api/';

// ============= Initialize Page =============

document.addEventListener('DOMContentLoaded', function() {
    checkUserAuthentication();
    loadUserProfile();
    initializeModalListeners();
});

function checkUserAuthentication() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        // Redirect to landing page if not logged in
        window.location.href = 'LandingPage.html';
    }
}

// ============= Cart Functions =============

let cart = {};

function addToCart(name, price) {
    if (cart[name]) {
        cart[name].qty += 1;
    } else {
        cart[name] = { price, qty: 1 };
    }
    updateCart();
}

function updateQty(name, change) {
    cart[name].qty += change;
    if (cart[name].qty <= 0) {
        delete cart[name];
    }
    updateCart();
}

function removeItem(name) {
    delete cart[name];
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';

    let subtotal = 0;
    Object.entries(cart).forEach(([name, { price, qty }]) => {
        const itemTotal = price * qty;
        subtotal += itemTotal;

        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
            <div class="cart-item-header">
                <span>${name}</span>
                <span class="cart-item-price">₱${(price * qty).toLocaleString()}</span>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="updateQty('${name}', -1)">−</button>
                <div class="qty-display">${qty}</div>
                <button class="qty-btn" onclick="updateQty('${name}', 1)">+</button>
                <button class="remove-btn" onclick="removeItem('${name}')">✕</button>
            </div>
        `;
        cartItems.appendChild(item);
    });

    const tax = Math.round(subtotal * 0.12);
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = '₱' + subtotal.toLocaleString();
    document.getElementById('tax').textContent = '₱' + tax.toLocaleString();
    document.getElementById('total').textContent = '₱' + total.toLocaleString();
}

// ============= Modal Functions =============

function toggleDropdown() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('active');
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    document.getElementById('dropdownMenu').classList.remove('active');
}

function openProfileModal() {
    closeModals();
    loadUserProfile();
    document.getElementById('profileModal').classList.add('active');
}

function openChangePasswordModal() {
    closeModals();
    document.getElementById('changePasswordModal').classList.add('active');
}

function openSettingsModal() {
    closeModals();
    document.getElementById('settingsModal').classList.add('active');
}

// ============= Load User Profile =============

function loadUserProfile() {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    if (!token || !userId) {
        return;
    }

    // Update header with user name
    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) {
        profileBtn.title = userName || 'Profile';
    }

    // Fetch full profile from backend
    fetch(`${API_BASE}users.php?action=profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const user = data.data;
            updateProfileModal(user);
        } else {
            console.error('Failed to load profile:', data.message);
            // Use localStorage data as fallback
            updateProfileModalFallback(userName, userEmail);
        }
    })
    .catch(error => {
        console.error('Error loading profile:', error);
        // Use localStorage data as fallback
        updateProfileModalFallback(userName, userEmail);
    });
}

function updateProfileModal(user) {
    // Update profile header
    const profileInfo = document.querySelector('.profile-info');
    if (profileInfo) {
        profileInfo.innerHTML = `
            <h3>${user.first_name} ${user.last_name}</h3>
            <p>${user.email}</p>
            <p style="margin-top: 8px; font-size: 12px;">Member since ${formatDate(user.created_at)}</p>
        `;
    }

    // Update form fields
    const formInputs = document.querySelectorAll('#profileModal input, #profileModal textarea');
    const inputs = Array.from(formInputs);

    if (inputs.length >= 7) {
        inputs[0].value = user.first_name || '';
        inputs[1].value = user.last_name || '';
        inputs[2].value = user.email || '';
        inputs[3].value = user.phone || '';
        inputs[4].value = user.city || '';
        inputs[5].value = user.province || '';
        inputs[6].value = user.bio || '';
    }

    // Store user data for later use
    localStorage.setItem('userPhone', user.phone || '');
    localStorage.setItem('userCity', user.city || '');
    localStorage.setItem('userProvince', user.province || '');
    localStorage.setItem('userBio', user.bio || '');
}

function updateProfileModalFallback(userName, userEmail) {
    const profileInfo = document.querySelector('.profile-info');
    if (profileInfo) {
        profileInfo.innerHTML = `
            <h3>${userName || 'User'}</h3>
            <p>${userEmail || 'No email'}</p>
            <p style="margin-top: 8px; font-size: 12px;">Member since January 2025</p>
        `;
    }

    const formInputs = document.querySelectorAll('#profileModal input, #profileModal textarea');
    const inputs = Array.from(formInputs);
    if (inputs.length >= 2) {
        const nameParts = (userName || '').split(' ');
        inputs[0].value = nameParts[0] || '';
        inputs[1].value = nameParts.slice(1).join(' ') || '';
        inputs[2].value = userEmail || '';
    }
}

function formatDate(dateString) {
    if (!dateString) return 'January 2025';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

// ============= Profile Actions =============

function handleProfileSave(e) {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    const form = e.target;
    const inputs = form.querySelectorAll('input, textarea');

    const profileData = {
        firstName: inputs[0].value,
        lastName: inputs[1].value,
        phone: inputs[3].value,
        city: inputs[4].value,
        province: inputs[5].value,
        bio: inputs[6].value
    };

    fetch(`${API_BASE}users.php?action=update-profile`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showAlert('alertProfile', 'Profile updated successfully!', 'success');
            // Update localStorage
            localStorage.setItem('userName', `${profileData.firstName} ${profileData.lastName}`);
            setTimeout(() => closeModals(), 2000);
        } else {
            showAlert('alertProfile', 'Error: ' + data.message, 'error');
        }
    })
    .catch(error => {
        showAlert('alertProfile', 'Failed to update profile', 'error');
        console.error('Error:', error);
    });
}

function handleChangePassword(e) {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    const form = e.target;
    const inputs = form.querySelectorAll('input[type="password"]');

    const currentPassword = inputs[0].value;
    const newPassword = inputs[1].value;
    const confirmPassword = inputs[2].value;

    // Validation
    if (newPassword !== confirmPassword) {
        showAlert('alertPassword', 'New passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 8) {
        showAlert('alertPassword', 'Password must be at least 8 characters', 'error');
        return;
    }

    fetch(`${API_BASE}users.php?action=change-password`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            currentPassword: currentPassword,
            newPassword: newPassword
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showAlert('alertPassword', 'Password changed successfully! Please log in again.', 'success');
            setTimeout(() => {
                handleLogout();
            }, 2000);
        } else {
            showAlert('alertPassword', 'Error: ' + data.message, 'error');
        }
    })
    .catch(error => {
        showAlert('alertPassword', 'Failed to change password', 'error');
        console.error('Error:', error);
    });
}

function handleLogout() {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userCity');
    localStorage.removeItem('userProvince');
    localStorage.removeItem('userBio');

    alert('Logged out successfully');
    window.location.href = 'LandingPage.html';
}

function handleDeleteAccount() {
    if (confirm('Are you sure? This will permanently delete your account and all data. This action cannot be undone.')) {
        if (confirm('This is irreversible. Type "DELETE" to confirm:\n\n(In a real app, you would type DELETE)')) {
            alert('Account deleted successfully.');
            handleLogout();
        }
    }
}

// ============= Helper Functions =============

function checkPasswordStrength(password) {
    const bars = document.querySelectorAll('.password-strength .strength-bar');
    const text = document.querySelector('.strength-text');
    bars.forEach(b => b.classList.remove('filled', 'medium', 'strong'));

    if (password.length === 0) {
        text.textContent = 'Weak';
        text.className = 'strength-text weak';
        return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength === 1 || strength === 2) {
        bars[0].classList.add('filled');
        text.textContent = 'Weak';
        text.className = 'strength-text weak';
    } else if (strength === 3) {
        bars[0].classList.add('filled', 'medium');
        bars[1].classList.add('filled', 'medium');
        text.textContent = 'Medium';
        text.className = 'strength-text medium';
    } else if (strength === 4) {
        bars[0].classList.add('filled', 'strong');
        bars[1].classList.add('filled', 'strong');
        bars[2].classList.add('filled', 'strong');
        text.textContent = 'Strong';
        text.className = 'strength-text strong';
    }
}

function toggleSetting(element) {
    element.classList.toggle('active');
}

function showAlert(elementId, message, type) {
    const alert = document.getElementById(elementId);
    alert.textContent = message;
    alert.className = `alert show alert-${type}`;
    setTimeout(() => alert.classList.remove('show'), 3000);
}

// ============= Event Listeners =============

function initializeModalListeners() {
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModals();
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const profileBtn = document.querySelector('.profile-btn');
        if (profileBtn && !profileBtn.contains(e.target)) {
            document.getElementById('dropdownMenu').classList.remove('active');
        }
    });
}

function goToLanding() {
    window.location.href = 'LandingPage.html';
}


// ============= NOTIFICATION SYSTEM =============

// Create toast container on page load
function initializeNotificationSystem() {
    if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

// Show Toast Notification
function showToast(title, message, type = 'info', duration = 3000) {
    const container = document.querySelector('.toast-container');
    if (!container) {
        initializeNotificationSystem();
        return showToast(title, message, type, duration);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon mapping
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            ${message ? `<div class="toast-message">${message}</div>` : ''}
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        <div class="toast-progress"></div>
    `;

    container.appendChild(toast);

    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    return toast;
}

// Show Confirmation Dialog
function showConfirmDialog(options) {
    const {
        title = 'Confirm Action',
        message = 'Are you sure you want to proceed?',
        type = 'warning', // 'warning', 'danger', 'info'
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        onConfirm = () => {},
        onCancel = () => {}
    } = options;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';

    // Icon mapping
    const icons = {
        warning: '⚠',
        danger: '🗑',
        info: 'ℹ'
    };

    overlay.innerHTML = `
        <div class="dialog ${type}">
            <div class="dialog-header">
                <div class="dialog-icon">${icons[type] || icons.warning}</div>
                <div class="dialog-content">
                    <div class="dialog-title">${title}</div>
                    <div class="dialog-message">${message}</div>
                </div>
            </div>
            <div class="dialog-footer">
                <button class="dialog-btn dialog-btn-cancel">${cancelText}</button>
                <button class="dialog-btn dialog-btn-confirm ${type === 'danger' ? 'danger' : ''}">${confirmText}</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => {
        overlay.style.display = 'flex';
    });

    // Handle buttons
    const cancelBtn = overlay.querySelector('.dialog-btn-cancel');
    const confirmBtn = overlay.querySelector('.dialog-btn-confirm');

    function closeDialog(callback) {
        overlay.classList.add('removing');
        setTimeout(() => {
            overlay.remove();
            if (callback) callback();
        }, 200);
    }

    cancelBtn.addEventListener('click', () => {
        closeDialog(onCancel);
    });

    confirmBtn.addEventListener('click', () => {
        closeDialog(onConfirm);
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeDialog(onCancel);
        }
    });

    // Close on Escape key
    function handleEscape(e) {
        if (e.key === 'Escape') {
            closeDialog(onCancel);
            document.removeEventListener('keydown', handleEscape);
        }
    }
    document.addEventListener('keydown', handleEscape);
}

// ============= THEME SYSTEM =============

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme options
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === theme) {
            option.classList.add('active');
        }
    });

    showToast('Theme Updated', `Switched to ${theme} mode`, 'success', 2000);
}

// ============= UPDATED FUNCTIONS =============

// Updated Logout Handler with Confirmation Dialog
function handleLogout() {
    closeModals();
    
    showConfirmDialog({
        title: 'Logout',
        message: 'Are you sure you want to logout? You will need to login again to access your account.',
        type: 'warning',
        confirmText: 'Logout',
        cancelText: 'Cancel',
        onConfirm: () => {
            // Clear localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userPhone');
            localStorage.removeItem('userCity');
            localStorage.removeItem('userProvince');
            localStorage.removeItem('userBio');

            showToast('Logged Out', 'You have been successfully logged out', 'success', 2000);
            
            setTimeout(() => {
                window.location.href = 'LandingPage.html';
            }, 1500);
        }
    });
}

// Updated Delete Account Handler with Confirmation Dialog
function handleDeleteAccount() {
    closeModals();
    
    showConfirmDialog({
        title: 'Delete Account',
        message: 'This will permanently delete your account and all associated data. This action cannot be undone. Are you absolutely sure?',
        type: 'danger',
        confirmText: 'Delete Account',
        cancelText: 'Cancel',
        onConfirm: () => {
            // Show second confirmation
            showConfirmDialog({
                title: 'Final Confirmation',
                message: 'This is your last chance. Your account and all data will be permanently deleted.',
                type: 'danger',
                confirmText: 'Yes, Delete Forever',
                cancelText: 'Cancel',
                onConfirm: () => {
                    showToast('Account Deleted', 'Your account has been permanently deleted', 'success', 2000);
                    
                    setTimeout(() => {
                        handleLogout();
                    }, 1500);
                }
            });
        }
    });
}

// Updated Profile Save Handler with Toast
function handleProfileSave(e) {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    const form = e.target;
    const inputs = form.querySelectorAll('input, textarea');

    const profileData = {
        firstName: inputs[0].value,
        lastName: inputs[1].value,
        phone: inputs[3].value,
        city: inputs[4].value,
        province: inputs[5].value,
        bio: inputs[6].value
    };

    // Show loading toast
    const loadingToast = showToast('Saving...', 'Updating your profile', 'info', 0);

    fetch(`${API_BASE}users.php?action=update-profile`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
    })
    .then(res => res.json())
    .then(data => {
        loadingToast.remove();
        
        if (data.success) {
            showToast('Success!', 'Profile updated successfully', 'success', 3000);
            
            // Update localStorage
            localStorage.setItem('userName', `${profileData.firstName} ${profileData.lastName}`);
            
            setTimeout(() => closeModals(), 1500);
        } else {
            showToast('Error', data.message || 'Failed to update profile', 'error', 4000);
        }
    })
    .catch(error => {
        loadingToast.remove();
        showToast('Error', 'Failed to update profile. Please try again.', 'error', 4000);
        console.error('Error:', error);
    });
}

// Updated Change Password Handler with Toast
function handleChangePassword(e) {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    const form = e.target;
    const inputs = form.querySelectorAll('input[type="password"]');

    const currentPassword = inputs[0].value;
    const newPassword = inputs[1].value;
    const confirmPassword = inputs[2].value;

    // Validation
    if (newPassword !== confirmPassword) {
        showToast('Password Mismatch', 'New passwords do not match', 'error', 3000);
        return;
    }

    if (newPassword.length < 8) {
        showToast('Weak Password', 'Password must be at least 8 characters', 'error', 3000);
        return;
    }

    // Password strength check
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[^a-zA-Z\d]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        showToast('Weak Password', 'Password must contain uppercase, lowercase, numbers, and special characters', 'error', 4000);
        return;
    }

    // Show loading toast
    const loadingToast = showToast('Updating...', 'Changing your password', 'info', 0);

    fetch(`${API_BASE}users.php?action=change-password`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            currentPassword: currentPassword,
            newPassword: newPassword
        })
    })
    .then(res => res.json())
    .then(data => {
        loadingToast.remove();
        
        if (data.success) {
            showToast('Password Changed', 'You will be logged out for security', 'success', 3000);
            
            setTimeout(() => {
                handleLogout();
            }, 2000);
        } else {
            showToast('Error', data.message || 'Failed to change password', 'error', 4000);
        }
    })
    .catch(error => {
        loadingToast.remove();
        showToast('Error', 'Failed to change password. Please try again.', 'error', 4000);
        console.error('Error:', error);
    });
}

// Add to Cart with Toast
function addToCart(name, price) {
    if (cart[name]) {
        cart[name].qty += 1;
        showToast('Updated Cart', `Increased ${name} quantity`, 'info', 2000);
    } else {
        cart[name] = { price, qty: 1 };
        showToast('Added to Cart', `${name} added successfully`, 'success', 2000);
    }
    updateCart();
}

// Remove from Cart with Toast
function removeItem(name) {
    delete cart[name];
    showToast('Item Removed', `${name} removed from cart`, 'info', 2000);
    updateCart();
}

// ============= INITIALIZE ON PAGE LOAD =============

document.addEventListener('DOMContentLoaded', function() {
    initializeNotificationSystem();
    initializeTheme();
    checkUserAuthentication();
    loadUserProfile();
    initializeModalListeners();
});