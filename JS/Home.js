// API Configuration
const API_BASE = 'http://localhost/Thrift-Clothing/api/';

// ============= Initialize Page =============

document.addEventListener('DOMContentLoaded', function() {
    initializeNotificationSystem();
    initializeTheme();
    checkUserAuthentication();
    loadUserProfile();
    initializeModalListeners();
    initializeProductCatalog();
    initializeCart(); // ADD THIS LINE
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
        showToast('Updated Cart', `Increased ${name} quantity`, 'info', 2000);
    } else {
        cart[name] = { price, qty: 1 };
        showToast('Added to Cart', `${name} added successfully`, 'success', 2000);
    }
    updateCart();
    saveCart(); // ADD THIS LINE
}

function updateQty(name, change) {
    if (!cart[name]) return; // ADD THIS LINE
    
    cart[name].qty += change;
    if (cart[name].qty <= 0) {
        removeItem(name); // CHANGED: call removeItem instead of delete
    } else {
        updateCart();
        saveCart(); // ADD THIS LINE
    }
}

function removeItem(name) {
    showConfirmDialog({
        title: 'Remove Item',
        message: `Are you sure you want to remove "${name}" from your cart?`,
        type: 'warning',
        confirmText: 'Remove',
        cancelText: 'Cancel',
        onConfirm: () => {
            delete cart[name];
            showToast('Item Removed', `${name} removed from cart`, 'info', 2000);
            updateCart();
            saveCart(); // ADD THIS LINE
        }
    });
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.querySelector('.cart-count');
    
    if (!cartItems) return;
    
    // Calculate total items
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    
    // Update cart count badge
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Update cart header text
    const cartHeader = document.querySelector('.cart-header h2');
    if (cartHeader) {
        cartHeader.textContent = `Order Bill (${totalItems})`;
    }

    // If cart is empty, show empty state
    if (totalItems === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart-state">
                <div class="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some items to get started!</p>
            </div>
        `;
        
        document.getElementById('subtotal').textContent = '₱0';
        document.getElementById('tax').textContent = '₱0';
        document.getElementById('total').textContent = '₱0';
        return;
    }

    // Render cart items
    cartItems.innerHTML = '';
    let subtotal = 0;
    
    Object.entries(cart).forEach(([name, { price, qty }]) => {
        const itemTotal = price * qty;
        subtotal += itemTotal;

        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
            <div class="cart-item-header">
                <span class="cart-item-name">${escapeHtml(name)}</span>
                <span class="cart-item-price">₱${itemTotal.toLocaleString()}</span>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="updateQty('${escapeHtml(name)}', -1)">−</button>
                <div class="qty-display">${qty}</div>
                <button class="qty-btn" onclick="updateQty('${escapeHtml(name)}', 1)">+</button>
                <button class="remove-btn" onclick="removeItem('${escapeHtml(name)}')">✕</button>
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


// ============= PRODUCT CATALOG SYSTEM =============

// Product state
let products = [];
let filteredProducts = [];
let currentFilters = {
    category: 'all',
    priceMin: 0,
    priceMax: 10000,
    condition: 'all',
    brand: 'all',
    sort: 'newest'
};
let currentPage = 0;
const productsPerPage = 12;
let totalProducts = 0;

// Initialize product catalog
function initializeProductCatalog() {
    loadProducts();
    initializeFilterListeners();
}

// Load products from API
async function loadProducts(append = false) {
    const productGrid = document.querySelector('.products-grid');
    
    if (!productGrid) {
        console.error('Product grid not found in DOM');
        return;
    }
    
    if (!append) {
        productGrid.innerHTML = createSkeletonLoaders(12);
    }

    try {
        const params = new URLSearchParams({
            action: 'all',
            limit: productsPerPage,
            offset: currentPage * productsPerPage,
            category: currentFilters.category,
            sort: currentFilters.sort
        });

        const response = await fetch(`${API_BASE}products.php?${params}`);
        const data = await response.json();

        if (data.success) {
            const newProducts = data.data.products;
            totalProducts = data.data.total;

            if (append) {
                products = [...products, ...newProducts];
            } else {
                products = newProducts;
            }

            // Apply client-side filters (price, condition, brand)
            applyFilters();
            renderProducts();
            updateLoadMoreButton();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        productGrid.innerHTML = createErrorState();
        showToast('Error', 'Failed to load products. Please refresh.', 'error', 4000);
    }
}

// Apply client-side filters
function applyFilters() {
    filteredProducts = products.filter(product => {
        // Price filter
        if (product.price < currentFilters.priceMin || product.price > currentFilters.priceMax) {
            return false;
        }

        // Condition filter
        if (currentFilters.condition !== 'all' && product.condition.toLowerCase() !== currentFilters.condition.toLowerCase()) {
            return false;
        }

        // Brand filter (if brand exists)
        if (currentFilters.brand !== 'all' && product.brand && product.brand.toLowerCase() !== currentFilters.brand.toLowerCase()) {
            return false;
        }

        return true;
    });
}

// Render products to DOM
function renderProducts() {
    const productGrid = document.querySelector('.products-grid');

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = createEmptyState();
        return;
    }

    productGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

// Create product card HTML
// Create product card HTML
function createProductCard(product) {
    // Check if image_url exists and is valid
    let imageUrl = '';
    
    // Only use product.image_url if it exists and doesn't contain placeholder URLs
    if (product.image_url && 
        !product.image_url.includes('placeholder') && 
        !product.image_url.includes('placehold') &&
        product.image_url.trim() !== '') {
        imageUrl = product.image_url;
    }
    
    const formattedPrice = parseFloat(product.price).toLocaleString();
    const stockStatus = product.stock > 0 ? 'In Stock' : 'Out of Stock';
    const stockClass = product.stock > 0 ? 'in-stock' : 'out-of-stock';
    const condition = product.condition || product.conditions || 'Good';
    
    // Escape product name for use in onclick
    const safeName = escapeHtml(product.name);
    const safeNameForJs = product.name.replace(/'/g, "\\'").replace(/"/g, '\\"');

    // Determine if we should show image or placeholder
    const hasImage = imageUrl !== '';
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-container ${!hasImage ? 'no-image' : ''}">
                ${hasImage ? 
                    `<img src="${imageUrl}" 
                         alt="${safeName}" 
                         class="product-image" 
                         onerror="this.style.display='none'; this.parentElement.classList.add('no-image');">` 
                    : 
                    `<div class="image-placeholder">
                        <div class="placeholder-icon">🖼️</div>
                        <div class="placeholder-text">No Image</div>
                    </div>`
                }
                <div class="product-badge">${condition}</div>
                ${product.stock <= 5 && product.stock > 0 ? '<div class="product-badge low-stock">Low Stock</div>' : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${safeName}</h3>
                ${product.brand ? `<div class="product-brand">${product.brand}</div>` : ''}
                <p class="product-description">${truncateText(product.description, 80)}</p>
                <div class="product-footer">
                    <span class="product-price">₱${formattedPrice}</span>
                    <span class="product-stock ${stockClass}">${stockStatus}</span>
                </div>
                ${product.stock > 0 ? 
                    `<button class="add-to-cart-btn" onclick="addToCart('${safeNameForJs}', ${product.price})">
                        <span>Add to Cart</span>
                        <span class="cart-icon">🛒</span>
                    </button>` : 
                    `<button class="add-to-cart-btn disabled" disabled>Out of Stock</button>`
                }
            </div>
        </div>
    `;
}


// Truncate text helper
function truncateText(text, maxLength) {
    if (!text) return 'No description available';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Create skeleton loaders
function createSkeletonLoaders(count) {
    return Array(count).fill().map(() => `
        <div class="product-card skeleton">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton-line short"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line medium"></div>
            </div>
        </div>
    `).join('');
}

// Create empty state
function createEmptyState() {
    return `
        <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>No Products Found</h3>
            <p>Try adjusting your filters or search criteria</p>
            <button class="clear-filters-btn" onclick="clearAllFilters()">Clear All Filters</button>
        </div>
    `;
}

// Create error state
function createErrorState() {
    return `
        <div class="empty-state error">
            <div class="empty-icon">⚠️</div>
            <h3>Failed to Load Products</h3>
            <p>Something went wrong. Please try again.</p>
            <button class="retry-btn" onclick="loadProducts()">Retry</button>
        </div>
    `;
}

// ============= FILTER SYSTEM =============

function initializeFilterListeners() {
    // Category filter
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            currentFilters.category = item.dataset.category || 'all';
            currentPage = 0;
            loadProducts();
            
            showToast('Filter Applied', `Showing ${item.textContent.trim()} products`, 'info', 2000);
        });
    });

    // Price range filter
    const priceMin = document.querySelector('.price-min');
    const priceMax = document.querySelector('.price-max');
    
    if (priceMin && priceMax) {
        const applyPriceFilter = () => {
            currentFilters.priceMin = parseFloat(priceMin.value) || 0;
            currentFilters.priceMax = parseFloat(priceMax.value) || 10000;
            applyFilters();
            renderProducts();
            showToast('Price Filter', `₱${currentFilters.priceMin} - ₱${currentFilters.priceMax}`, 'info', 2000);
        };

        priceMin.addEventListener('change', applyPriceFilter);
        priceMax.addEventListener('change', applyPriceFilter);
    }

    // Condition filter
    document.querySelectorAll('.filter-checkbox[data-filter="condition"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Uncheck other condition checkboxes
            document.querySelectorAll('.filter-checkbox[data-filter="condition"]').forEach(cb => {
                if (cb !== checkbox) cb.checked = false;
            });

            currentFilters.condition = checkbox.checked ? checkbox.dataset.value : 'all';
            applyFilters();
            renderProducts();
            
            if (checkbox.checked) {
                showToast('Condition Filter', `Showing ${checkbox.dataset.value} items`, 'info', 2000);
            }
        });
    });

    // Brand filter
    document.querySelectorAll('.filter-checkbox[data-filter="brand"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Uncheck other brand checkboxes
            document.querySelectorAll('.filter-checkbox[data-filter="brand"]').forEach(cb => {
                if (cb !== checkbox) cb.checked = false;
            });

            currentFilters.brand = checkbox.checked ? checkbox.dataset.value : 'all';
            applyFilters();
            renderProducts();
            
            if (checkbox.checked) {
                showToast('Brand Filter', `Showing ${checkbox.dataset.value} products`, 'info', 2000);
            }
        });
    });

    // Sort dropdown
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentFilters.sort = e.target.value;
            currentPage = 0;
            loadProducts();
            
            const sortLabels = {
                'newest': 'Newest First',
                'price_low': 'Price: Low to High',
                'price_high': 'Price: High to Low',
                'best_sellers': 'Best Sellers'
            };
            
            showToast('Sorted', sortLabels[e.target.value], 'info', 2000);
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchProducts(e.target.value);
            }, 500); // Debounce 500ms
        });
    }
}

// Search products
function searchProducts(query) {
    if (!query || query.trim() === '') {
        applyFilters();
        renderProducts();
        return;
    }

    const searchTerm = query.toLowerCase();
    filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(searchTerm) ||
               (product.description && product.description.toLowerCase().includes(searchTerm)) ||
               (product.brand && product.brand.toLowerCase().includes(searchTerm));
    });

    renderProducts();
    showToast('Search', `Found ${filteredProducts.length} product(s)`, 'info', 2000);
}

// Clear all filters
function clearAllFilters() {
    // Reset filters
    currentFilters = {
        category: 'all',
        priceMin: 0,
        priceMax: 10000,
        condition: 'all',
        brand: 'all',
        sort: 'newest'
    };
    currentPage = 0;

    // Reset UI
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.category === 'all') {
            item.classList.add('active');
        }
    });

    document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
    
    const priceMin = document.querySelector('.price-min');
    const priceMax = document.querySelector('.price-max');
    if (priceMin) priceMin.value = 0;
    if (priceMax) priceMax.value = 10000;

    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) sortSelect.value = 'newest';

    const searchInput = document.querySelector('.search-input');
    if (searchInput) searchInput.value = '';

    loadProducts();
    showToast('Filters Cleared', 'Showing all products', 'success', 2000);
}

// ============= PAGINATION =============

function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;

    const loadedCount = (currentPage + 1) * productsPerPage;
    
    if (loadedCount >= totalProducts) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.textContent = `Load More (${loadedCount} of ${totalProducts})`;
    }
}

function loadMoreProducts() {
    currentPage++;
    loadProducts(true);
}

// Initialize cart from localStorage
function initializeCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCart();
        } catch (error) {
            console.error('Error loading cart:', error);
            cart = {};
        }
    }
}

// Save cart to localStorage
function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

function clearCart() {
    showConfirmDialog({
        title: 'Clear Cart',
        message: 'Are you sure you want to remove all items from your cart?',
        type: 'warning',
        confirmText: 'Clear Cart',
        cancelText: 'Cancel',
        onConfirm: () => {
            cart = {};
            showToast('Cart Cleared', 'All items removed from cart', 'success', 2000);
            updateCart();
            saveCart();
        }
    });
}

function handleCheckout() {
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    
    if (totalItems === 0) {
        showToast('Empty Cart', 'Please add items to your cart first', 'warning', 3000);
        return;
    }
    
    showConfirmDialog({
        title: 'Coming Soon',
        message: 'Checkout functionality is currently under development. This feature will be available soon!',
        type: 'info',
        confirmText: 'Got it',
        cancelText: '',
        onConfirm: () => {}
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}