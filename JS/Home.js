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

        function handleProfileSave(e) {
            e.preventDefault();
            showAlert('alertProfile', 'Profile updated successfully!', 'success');
            setTimeout(() => closeModals(), 2000);
        }

        function handleChangePassword(e) {
            e.preventDefault();
            showAlert('alertPassword', 'Password changed successfully! Please log in again.', 'success');
            setTimeout(() => closeModals(), 2000);
        }

        function handleLogout() {
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = 'LandingPage.html';
                closeModals();
            }
        }

        function handleDeleteAccount() {
            if (confirm('Are you sure? This will permanently delete your account and all data. This action cannot be undone.')) {
                if (confirm('Please type "DELETE" to confirm account deletion:\n\n(In a real app, you would need to type DELETE)')) {
                    alert('Account deleted successfully.');
                    closeModals();
                }
            }
        }

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

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModals();
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const profileBtn = document.querySelector('.profile-btn');
            if (!profileBtn.contains(e.target)) {
                document.getElementById('dropdownMenu').classList.remove('active');
            }
        });

        function goToLanding() {
            window.location.href = 'Home.html';
        }
