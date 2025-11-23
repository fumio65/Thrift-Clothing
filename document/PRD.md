# Product Requirements Document (PRD)
## Thrift Clothing - Sustainable Fashion E-Commerce Platform

## 14. Git Workflow & Commit Conventions

### 14.1 Branching Strategy

**Main Branches:**
- `main` - Production-ready code (stable releases)
- `develop` - Integration branch for features (active development)

**Feature Branches:**
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Urgent production fixes
- `refactor/code-improvement` - Code refactoring
- `docs/documentation-update` - Documentation changes
- `test/test-implementation` - Test additions

**Branch Naming Convention:**
```bash
feature/user-authentication
feature/shopping-cart
feature/checkout-flow
bugfix/login-validation
hotfix/payment-crash
refactor/api-structure
docs/api-documentation
test/cart-unit-tests
```

### 14.2 Commit Message Format (Conventional Commits)

**Structure:**
```
<type>(<scope>): <subject>

<body> (optional)

<footer> (optional)
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, missing semicolons, etc.)
- `refactor` - Code refactoring without feature changes
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks (build, dependencies, etc.)
- `ci` - CI/CD configuration changes
- `revert` - Reverting previous commits

**Examples:**

```bash
# Feature commits
feat(auth): implement user registration with email validation
feat(cart): add real-time price calculation
feat(checkout): integrate payment simulation
feat(products): add dynamic filtering by category

# Bug fix commits
fix(auth): resolve JWT token expiration issue
fix(cart): prevent negative quantity values
fix(profile): fix phone number validation regex

# Refactoring commits
refactor(api): restructure error response format
refactor(cart): optimize cart state management
refactor(ui): improve modal component reusability

# Style commits
style(home): update dark mode color scheme
style(checkout): improve form input spacing
style(global): add consistent button hover effects

# Documentation commits
docs(readme): add setup instructions
docs(api): document authentication endpoints
docs(prd): update feature status and timeline

# Performance commits
perf(products): add database indexing for faster queries
perf(images): implement lazy loading for product images

# Test commits
test(auth): add unit tests for password validation
test(cart): add integration tests for cart operations

# Chore commits
chore(deps): update PHP dependencies
chore(config): update database connection settings
chore(build): configure production build process
```

### 14.3 Workflow Example

**Starting a new feature:**
```bash
# 1. Create and switch to feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/logout-dialog

# 2. Make changes and commit
git add .
git commit -m "feat(auth): replace logout alert with confirmation dialog"

# 3. Continue working with descriptive commits
git commit -m "style(auth): improve logout dialog styling"
git commit -m "test(auth): add logout confirmation tests"

# 4. Push feature branch
git push origin feature/logout-dialog

# 5. Create Pull Request to develop
# (On GitHub/GitLab: develop ← feature/logout-dialog)

# 6. After review and approval, merge to develop
git checkout develop
git merge feature/logout-dialog
git push origin develop

# 7. Delete feature branch (after merge)
git branch -d feature/logout-dialog
git push origin --delete feature/logout-dialog
```

### 14.4 Commit Best Practices

**DO:**
✅ Write clear, concise commit messages
✅ Use present tense ("add" not "added")
✅ Start with lowercase after type
✅ Keep subject line under 50 characters
✅ Use body for detailed explanations (if needed)
✅ Reference issue numbers in footer (e.g., "Closes #123")
✅ Make atomic commits (one logical change per commit)
✅ Commit frequently with meaningful messages

**DON'T:**
❌ Use vague messages ("fix stuff", "update", "changes")
❌ Combine unrelated changes in one commit
❌ Commit broken/untested code to main branches
❌ Use periods at the end of subject line
❌ Commit sensitive data (passwords, API keys)

### 14.5 Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature (feat)
- [ ] Bug fix (fix)
- [ ] Breaking change
- [ ] Documentation update (docs)
- [ ] Code refactoring (refactor)
- [ ] Performance improvement (perf)

## Testing
- [ ] Tested locally
- [ ] All existing tests pass
- [ ] Added new tests (if applicable)

## Screenshots (if UI changes)
[Add screenshots here]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code sections
- [ ] Updated documentation (if needed)
- [ ] No console errors or warnings

## Related Issues
Closes #[issue number]
```

### 14.6 Release Versioning (Semantic Versioning)

**Format:** `MAJOR.MINOR.PATCH` (e.g., 1.0.0)

- **MAJOR** - Incompatible API changes
- **MINOR** - New features (backwards-compatible)
- **PATCH** - Bug fixes (backwards-compatible)

**Examples:**
- `v0.1.0` - Initial MVP release
- `v0.2.0` - Added checkout flow
- `v0.2.1` - Fixed cart calculation bug
- `v1.0.0` - First stable production release

**Git Tags:**
```bash
# Create a release tag
git tag -a v0.1.0 -m "Release version 0.1.0 - MVP"
git push origin v0.1.0

# List all tags
git tag -l

# Checkout specific version
git checkout v0.1.0
```

### 14.7 Project-Specific Commit Examples

**Authentication Module:**
```bash
feat(auth): implement user registration with validation
feat(auth): add JWT token generation for login
feat(auth): replace logout alert with confirmation dialog
fix(auth): resolve password strength validation regex
refactor(auth): extract validation functions to helpers
test(auth): add unit tests for registration flow
```

**Shopping Cart Module:**
```bash
feat(cart): implement add to cart functionality
feat(cart): add quantity update logic
feat(cart): implement cart persistence with localStorage
fix(cart): prevent duplicate items in cart
refactor(cart): optimize cart state management
perf(cart): reduce re-renders on cart updates
```

**Product Catalog Module:**
```bash
feat(products): connect product catalog to backend API
feat(products): implement dynamic product filtering
feat(products): add product search functionality
fix(products): resolve product image loading issue
style(products): improve product card hover effects
perf(products): implement pagination for large catalogs
```

**Checkout Module:**
```bash
feat(checkout): create checkout page with shipping form
feat(checkout): implement payment card validation
feat(checkout): add order creation API endpoint
fix(checkout): resolve tax calculation rounding error
test(checkout): add integration tests for order flow
```

---

## 1. Executive Summary

### 1.1 Product Vision
Thrift Clothing is a sustainable e-commerce platform that connects conscious consumers with curated secondhand fashion. The platform enables users to discover, purchase, and sell pre-loved clothing items at affordable prices while promoting environmental sustainability and circular fashion economy.

### 1.2 Target Audience
- **Primary**: Fashion-conscious individuals aged 18-35 seeking affordable, unique clothing
- **Secondary**: Sustainability advocates looking to reduce fashion waste
- **Tertiary**: Budget-conscious shoppers and vintage fashion enthusiasts

### 1.3 Business Goals
- Facilitate seamless buying and selling of secondhand clothing
- Reduce fashion waste through circular economy model
- Build a trusted community of conscious consumers
- Achieve 10,000+ active users within first year
- Process 1,000+ transactions monthly

---

## 2. Product Overview

### 2.1 Core Value Propositions
1. **Affordability** - Quality fashion at 50-80% below retail prices
2. **Sustainability** - Reduce fashion waste, promote circular economy
3. **Authenticity** - Every item verified and quality-checked
4. **Convenience** - Easy browsing, secure checkout, hassle-free returns
5. **Uniqueness** - One-of-a-kind vintage and designer finds

### 2.2 Product Type
Web-based e-commerce platform with potential mobile app expansion

### 2.3 Monetization Strategy
- Transaction fees on sales (10-15% commission)
- Premium seller accounts with enhanced features
- Promoted listings for sellers
- Partnership with sustainable fashion brands

---

## 3. User Personas

### 3.1 Persona 1: The Eco-Conscious Shopper
- **Name**: Maria, 26, Marketing Professional
- **Goals**: Find stylish clothes while minimizing environmental impact
- **Pain Points**: High prices of sustainable brands, limited options
- **Needs**: Verified quality items, transparent sourcing, easy returns

### 3.2 Persona 2: The Budget Hunter
- **Name**: Alex, 22, College Student
- **Goals**: Look fashionable on a tight budget
- **Pain Points**: Can't afford new clothes, worried about quality
- **Needs**: Affordable prices, good condition items, secure payments

### 3.3 Persona 3: The Vintage Enthusiast
- **Name**: Jamie, 31, Creative Designer
- **Goals**: Find unique, rare vintage pieces
- **Pain Points**: Time-consuming thrift store visits, limited inventory
- **Needs**: Diverse catalog, detailed item descriptions, condition ratings

---

## 4. Feature Requirements

### 4.1 Phase 1 - MVP (Current Implementation + Immediate Priorities)

#### 4.1.1 User Authentication & Profile ✅ IMPLEMENTED
- [x] User registration with email/password
- [x] Login with JWT authentication
- [x] Password strength validation (8+ chars, uppercase, lowercase, numbers, special chars)
- [x] Profile management (name, email, phone, location, bio)
- [x] Change password functionality
- [x] Account settings (notifications, privacy)
- [x] Account deletion option
- [ ] **TODO**: Replace logout alert with confirmation dialog modal
- [ ] **TODO**: Replace other alerts with styled notification toasts/dialogs

**Git Workflow:**
```
Branch: feature/auth-system
Commits:
✅ feat: implement user registration with validation
✅ feat: add JWT authentication for login
✅ feat: add profile management functionality
✅ feat: implement password change with validation
✅ feat: add account settings and preferences
⏳ feat: replace logout alert with confirmation dialog
⏳ refactor: replace alerts with notification system
```

#### 4.1.2 Product Catalog 🔄 PARTIAL
- [x] Product listing grid with responsive design
- [x] Product categories (Men, Women, Kids, Accessories)
- [x] Price range filters
- [x] Condition filters (Like New, Good, Fair)
- [x] Brand filters
- [ ] **TODO**: Connect frontend to products API
- [ ] **TODO**: Display real product images
- [ ] **TODO**: Product detail modal/page
- [ ] **TODO**: Dynamic filter implementation
- [ ] **TODO**: Search functionality
- [ ] **TODO**: Sorting (newest, price low-high, best sellers)

**Git Workflow:**
```
Branch: feature/product-catalog
Commits:
✅ feat: create product grid layout with responsive design
✅ feat: add product categories sidebar
✅ feat: add filter UI for price, condition, and brands
⏳ feat: connect product catalog to backend API
⏳ feat: implement dynamic product filtering
⏳ feat: add product search functionality
⏳ feat: implement product sorting options
⏳ feat: create product detail modal
```

#### 4.1.2.1 Theme System ✅ IMPLEMENTED
- [x] Dark mode (default theme)
- [x] Light mode option
- [x] Theme toggle in settings dialog
- [x] Theme preference persistence (localStorage)
- [x] Smooth theme transitions
- [x] CSS variable-based theming
- [x] Applied across all pages (LandingPage, Home, Checkout)

**Git Workflow:**
```
Branch: feature/theme-system
Commits:
⏳ feat: add CSS variables for dark and light themes
⏳ feat: implement theme toggle in settings dialog
⏳ feat: add theme persistence with localStorage
⏳ feat: apply theme system across all pages
⏳ style: add smooth transitions for theme switching
```

#### 4.1.3 Shopping Cart 🔄 PARTIAL (Display Only)
- [x] Cart UI sidebar with order summary
- [x] Display items layout
- [x] Quantity controls UI
- [x] Remove button UI
- [x] Subtotal/tax/total display structure
- [ ] **TODO**: Add to cart functionality (connect buttons)
- [ ] **TODO**: Update quantities logic
- [ ] **TODO**: Remove items logic
- [ ] **TODO**: Real-time calculations
- [ ] **TODO**: Cart persistence (localStorage or database)
- [ ] **TODO**: Cart sync with backend

**Current Status**: Cart sidebar displays correctly but buttons are not yet functional. Need to implement cart state management and CRUD operations.

**Git Workflow:**
```
Branch: feature/shopping-cart
Commits:
✅ feat: create cart sidebar UI with order summary
✅ feat: add cart item display layout
✅ style: add cart quantity controls and remove button UI
⏳ feat: implement add to cart functionality
⏳ feat: add cart quantity update logic
⏳ feat: implement remove item from cart
⏳ feat: add real-time cart calculations (subtotal, tax, total)
⏳ feat: implement cart persistence with localStorage
⏳ feat: sync cart with backend API (optional)
```

#### 4.1.4 Checkout & Orders ❌ NOT IMPLEMENTED
- [ ] **TODO**: Checkout page/modal
- [ ] **TODO**: Shipping address form
- [ ] **TODO**: Payment method selection
- [ ] **TODO**: Order summary review
- [ ] **TODO**: Order placement API
- [ ] **TODO**: Order confirmation page
- [ ] **TODO**: Order history page
- [ ] **TODO**: Order status tracking

**Git Workflow:**
```
Branch: feature/checkout-flow
Commits:
⏳ feat: create checkout page with shipping form
⏳ feat: add shipping address validation
⏳ feat: implement payment card input UI
⏳ feat: add order summary review section
⏳ feat: create order placement API endpoint
⏳ feat: implement order creation logic
⏳ feat: add order confirmation page
⏳ feat: create order history page
⏳ feat: implement order status tracking
⏳ test: add checkout flow integration tests
```

#### 4.1.5 Search & Discovery ❌ NOT IMPLEMENTED
- [x] Search bar UI (not connected)
- [ ] **TODO**: Product search by name/description
- [ ] **TODO**: Category-based browsing
- [ ] **TODO**: Price range filtering
- [ ] **TODO**: Condition filtering
- [ ] **TODO**: Brand filtering
- [ ] **TODO**: Multi-filter combinations

**Git Workflow:**
```
Branch: feature/search-discovery
Commits:
✅ feat: add search bar UI component
⏳ feat: implement product search API endpoint
⏳ feat: connect search bar to backend API
⏳ feat: add category-based browsing functionality
⏳ feat: implement dynamic price range filtering
⏳ feat: add condition filter functionality
⏳ feat: implement brand filtering
⏳ feat: add multi-filter combination support
⏳ perf: optimize search queries with indexing
```

---

### 4.2 Phase 2 - Enhanced Features (3-6 Months) 🎓 *Post-College/Optional*

**Note**: Phase 2 features are optional enhancements beyond the college project scope. The MVP (Phase 1) is sufficient for academic submission.

#### 4.2.1 Seller Functionality
- [ ] Seller registration/verification
- [ ] List items for sale
- [ ] Upload multiple product images
- [ ] Set price and condition
- [ ] Inventory management dashboard
- [ ] Sales analytics
- [ ] Earnings & payout system
- [ ] Seller ratings & reviews

#### 4.2.2 Advanced Product Features
- [ ] Wishlist/Save for later
- [ ] Size chart and fit guide
- [ ] Detailed condition reports with photos
- [ ] Product questions & answers
- [ ] Similar items suggestions

#### 4.2.3 Enhanced User Experience
- [ ] Advanced search with filters
- [ ] Dark/light theme toggle (Settings)
- [ ] Personalized homepage

#### 4.2.4 Social & Community
- [ ] User reviews and ratings
- [ ] Seller profiles with ratings
- [ ] Follow favorite sellers
- [ ] Style inspiration blog/gallery

#### 4.2.5 Payment & Shipping (Simplified for College Project)
- [ ] **Simple Payment Integration (Educational/Demo Purpose)**
  - **Card payment form** (card number, expiry, CVC)
  - **Test mode only** - No real transactions
  - **Stripe-style test cards** for simulation:
    - Success: `4242 4242 4242 4242`
    - Declined: `4000 0000 0000 0002`
  - **Payment validation** (Luhn algorithm for card number)
  - **Mock payment processing** with 1-2 second delay
  - **Order creation** after successful payment simulation
  - **Order confirmation page** with order details
- [ ] Fixed shipping fee (₱50)
- [ ] Basic order tracking (status display only)
- [ ] Simple return policy display

**🎓 College Project Note**: 
This payment system is a **simplified demonstration** for educational purposes. It simulates the payment flow without processing real transactions or connecting to actual payment gateways. Perfect for showcasing understanding of e-commerce workflows in academic projects.

---

### 4.3 Phase 3 - Advanced Platform (6-12 Months) 🎓 *Future Vision/Optional*

**Note**: Phase 3 represents the product's potential future direction and is not required for the college project.

#### 4.3.1 Mobile Application
- [ ] iOS native app
- [ ] Android native app
- [ ] Photo upload from mobile
- [ ] Push notifications
- [ ] Mobile-optimized checkout

#### 4.3.2 AI & Machine Learning
- [ ] Product recommendations (based on browsing history)
- [ ] Recently viewed items tracking
- [ ] Visual search (upload photo, find similar items)
- [ ] AI-powered size recommendations
- [ ] Price prediction algorithms
- [ ] Fraud detection
- [ ] Smart inventory management

#### 4.3.3 Advanced Communication & Marketing
- [ ] Email notifications system (order updates, new arrivals)
- [ ] Push notifications (web & mobile)
- [ ] Save search preferences
- [ ] Automated marketing campaigns
- [ ] Newsletter management
- [ ] SMS notifications integration

#### 4.3.4 Social Features
- [ ] Share products on social media
- [ ] Community forum/discussion board
- [ ] User-generated content showcase
- [ ] Social login (Facebook, Google)
- [ ] Influencer partnerships
- [ ] Referral program

#### 4.3.5 Admin & Analytics
- [ ] Admin dashboard
- [ ] User management
- [ ] Product approval system
- [ ] Content moderation tools
- [ ] Sales analytics & reporting
- [ ] Inventory management
- [ ] Customer support ticketing

#### 4.3.6 Sustainability Features
- [ ] Carbon footprint calculator (savings vs new items)
- [ ] Sustainability badges for users
- [ ] Donation/recycling program
- [ ] Partnership with eco-friendly shipping
- [ ] Impact metrics dashboard

---

## 5. Technical Architecture

### 5.0 File Structure & Organization

```
thrift-clothing/
│
├── api/                          # Backend API Endpoints
│   ├── auth.php                  # Authentication (login, register)
│   ├── users.php                 # User profile management
│   ├── products.php              # Product CRUD operations
│   ├── order.php                 # Order processing (TODO)
│   └── cart.php                  # Cart management (TODO)
│
├── CSS/                          # Stylesheets
│   ├── Home.css                  # Main shop page styles
│   ├── LandingPage.css           # Landing/marketing page styles
│   └── Checkout.css              # Checkout page styles (TODO)
│
├── JS/                           # JavaScript Files
│   ├── Home.js                   # Shop page logic & cart
│   ├── LandingPage.js            # Auth modals & landing interactions
│   └── Checkout.js               # Payment & order processing (TODO)
│
├── Database/                     # Database Scripts
│   └── thrift_clothing.sql      # Database schema & seed data
│
├── assets/                       # Static Assets (Optional)
│   ├── images/                   # Product images
│   ├── icons/                    # UI icons
│   └── fonts/                    # Custom fonts (if any)
│
├── docs/                         # Documentation (Optional)
│   ├── API.md                    # API documentation
│   ├── SETUP.md                  # Setup instructions
│   └── USER_MANUAL.md            # User guide
│
├── config.php                    # Database config & helper functions
├── Home.html                     # Main shop interface
├── LandingPage.html              # Landing page with auth
├── Checkout.html                 # Checkout page (TODO)
├── OrderSuccess.html             # Order confirmation (TODO)
├── README.md                     # Project overview
└── .gitignore                    # Git ignore file
```

#### 📁 File Responsibilities

**Frontend (HTML Pages)**
- `LandingPage.html` - Entry point, marketing, login/signup modals
- `Home.html` - Main shop interface, product grid, cart sidebar
- `Checkout.html` - Shipping form, payment, order review
- `OrderSuccess.html` - Order confirmation page

**Backend (API)**
- `config.php` - Database connection, JWT helpers, utility functions
- `api/auth.php` - User registration & login
- `api/users.php` - Profile updates, password changes, user orders
- `api/products.php` - Get products, filters, sorting, single product
- `api/order.php` - Create order, get order details, order history
- `api/cart.php` - Add/update/remove cart items (optional backend cart)

**Frontend Logic (JavaScript)**
- `JS/LandingPage.js` - Auth forms, validation, API calls for login/register
- `JS/Home.js` - Product display, cart management, profile modals
- `JS/Checkout.js` - Payment simulation, order creation, form validation

**Styles (CSS)**
- `CSS/LandingPage.css` - Landing page, hero, modals, footer
- `CSS/Home.css` - Shop layout, products grid, cart sidebar, modals
- `CSS/Checkout.css` - Checkout form, order summary (TODO)

#### 🔍 Debugging Guide

**Common Issues & Where to Look:**

| Issue | File to Check | What to Look For |
|-------|---------------|------------------|
| Login/Register not working | `api/auth.php` | Check database connection, SQL queries, password hashing |
| | `JS/LandingPage.js` | Verify API endpoint URL, request payload format |
| | Browser Console | Check for network errors, CORS issues |
| | | |
| Products not displaying | `api/products.php` | Verify query syntax, check database has data |
| | `JS/Home.js` | Check `loadProducts()` function, API response handling |
| | `Home.html` | Verify grid container exists with correct ID |
| | | |
| Cart not working | `JS/Home.js` | Check cart object structure, localStorage functions |
| | `Home.html` | Verify cart sidebar elements have correct IDs |
| | Browser DevTools | Check localStorage under Application tab |
| | | |
| Profile updates failing | `api/users.php` | Check JWT token validation, UPDATE query |
| | `JS/Home.js` | Verify Authorization header is sent |
| | | |
| Database connection error | `config.php` | Verify DB credentials (host, username, password, dbname) |
| | XAMPP Control Panel | Ensure MySQL service is running |
| | phpMyAdmin | Check database exists and has proper tables |
| | | |
| Payment not processing | `JS/Checkout.js` | Check card validation logic, order creation API call |
| | `api/order.php` | Verify order insertion query, check table structure |
| | | |
| Styling issues | `CSS/*.css` | Check CSS variable values, media queries |
| | Browser DevTools | Inspect element, check computed styles |
| | | |
| JWT token errors | `config.php` | Check token generation/verification functions |
| | `api/*.php` | Verify `getBearerToken()` extracts token correctly |
| | Browser DevTools | Check Authorization header in Network tab |

#### 🛠️ Debug Workflow

**1. Frontend Issues (UI/Display)**
```
Step 1: Open Browser DevTools (F12)
Step 2: Check Console tab for JavaScript errors
Step 3: Check Network tab for failed API calls
Step 4: Check Elements tab to inspect HTML structure
Step 5: Review relevant JS file for logic errors
```

**2. Backend Issues (API/Database)**
```
Step 1: Check PHP error logs (xampp/apache/logs/error.log)
Step 2: Add var_dump() or error_log() for debugging
Step 3: Test API directly in browser or Postman
Step 4: Check database in phpMyAdmin
Step 5: Verify config.php database credentials
```

**3. Database Issues**
```
Step 1: Open phpMyAdmin (http://localhost/phpmyadmin)
Step 2: Select 'thrift_clothing' database
Step 3: Check tables exist and have data
Step 4: Run SQL queries manually to test
Step 5: Check foreign key constraints
```

**4. Authentication Issues**
```
Step 1: Check localStorage has 'authToken' (DevTools > Application)
Step 2: Verify token format (should be JWT: xxx.yyy.zzz)
Step 3: Check API response in Network tab
Step 4: Verify password meets requirements (8 chars, etc.)
Step 5: Check users table in database
```

#### 📝 Code Comments Convention

**PHP Files:**
```php
// ============= Section Name =============
// Brief description of what this code does
```

**JavaScript Files:**
```javascript
// ============= Section Name =============
// Brief description of functionality
```

**CSS Files:**
```css
/* ============= Section Name ============= */
/* Component or page specific styles */
```

#### 🔧 Development Tools

**Essential Tools:**
- **Browser DevTools** (F12) - Debug frontend issues
- **phpMyAdmin** - Database management and debugging
- **Postman** - Test API endpoints directly
- **VS Code Extensions**:
  - PHP Intelephense (PHP IntelliSense)
  - Live Server (for quick testing)
  - ESLint (JavaScript linting)

**Quick Debug Snippets:**

**Check API Response (JavaScript):**
```javascript
fetch(API_BASE + 'endpoint')
  .then(res => res.json())
  .then(data => console.log('API Response:', data))
  .catch(err => console.error('API Error:', err));
```

**Debug PHP Variables:**
```php
error_log('Debug: ' . print_r($variable, true));
// Check: xampp/apache/logs/error.log
```

**Check Database Connection:**
```php
$conn = getConnection();
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
```

---

### 5.1 Current Tech Stack ✅
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: PHP 7.4+
- **Database**: MySQL 5.7+
- **Authentication**: JWT (JSON Web Tokens)
- **Server**: Apache (XAMPP)
- **API Design**: RESTful API
- **Payment**: Simulated payment flow (no real gateway integration)

**🎓 College Project Considerations:**
- Optimized for local development (XAMPP)
- No external API dependencies (except demo payment simulation)
- Simple deployment process
- Easy to present and demonstrate
- Minimal setup required for instructors to review

### 5.2 Database Schema (Existing)

#### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(100),
    province VARCHAR(100),
    bio TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    INDEX idx_email (email)
);
```

#### Products Table
```sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    condition VARCHAR(20) NOT NULL,
    brand VARCHAR(100),
    size VARCHAR(20),
    color VARCHAR(50),
    stock INT DEFAULT 0,
    sales INT DEFAULT 0,
    image_url VARCHAR(500),
    seller_id INT,
    status ENUM('active', 'sold', 'pending', 'inactive') DEFAULT 'active',
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    INDEX idx_category (category),
    INDEX idx_condition (condition),
    INDEX idx_price (price),
    FOREIGN KEY (seller_id) REFERENCES users(id)
);
```

#### Orders Table
```sql
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    shipping_address TEXT,
    shipping_city VARCHAR(100),
    shipping_province VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_order_number (order_number),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Order Items Table
```sql
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at DATETIME NOT NULL,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

#### Product Images Table (Future)
```sql
CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at DATETIME NOT NULL,
    INDEX idx_product (product_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

### 5.3 API Endpoints

#### Authentication (`api/auth.php`)
- ✅ `POST /auth.php?action=register` - User registration
- ✅ `POST /auth.php?action=login` - User login

#### Users (`api/users.php`) - Protected
- ✅ `GET /users.php?action=profile` - Get user profile
- ✅ `POST /users.php?action=update-profile` - Update profile
- ✅ `POST /users.php?action=change-password` - Change password
- ✅ `GET /users.php?action=orders` - Get user orders

#### Products (`api/products.php`)
- ✅ `GET /products.php?action=all` - Get all products (with filters)
- ✅ `GET /products.php?action=single&id={id}` - Get single product
- ✅ `POST /products.php?action=add` - Add product (protected)
- ⏳ `PUT /products.php?action=update&id={id}` - Update product
- ⏳ `DELETE /products.php?action=delete&id={id}` - Delete product

#### Orders (`api/order.php`) - TODO
- ⏳ `POST /order.php?action=create` - Create new order
- ⏳ `GET /order.php?action=details&id={id}` - Get order details
- ⏳ `GET /order.php?action=user-orders` - Get user's orders
- ⏳ `PUT /order.php?action=update-status&id={id}` - Update order status
- ⏳ `POST /order.php?action=cancel&id={id}` - Cancel order

#### Cart (`api/cart.php`) - TODO
- ⏳ `GET /cart.php?action=get` - Get user's cart
- ⏳ `POST /cart.php?action=add` - Add item to cart
- ⏳ `PUT /cart.php?action=update` - Update cart item quantity
- ⏳ `DELETE /cart.php?action=remove` - Remove item from cart
- ⏳ `DELETE /cart.php?action=clear` - Clear entire cart

---

## 6. User Flows

### 6.1 New User Registration Flow
1. User lands on homepage
2. Clicks "Sign Up" button
3. Fills registration form (name, email, password)
4. Accepts terms & conditions
5. Submits form
6. Receives success message
7. Automatically redirected to login
8. Logs in and redirected to shop page

**Current Status**: ✅ Fully Implemented

### 6.2 Product Discovery & Purchase Flow
1. User browses product catalog
2. Applies filters (category, price, condition, brand)
3. Clicks on product to view details
4. Reviews product information, images, condition
5. Selects size (if applicable)
6. Clicks "Add to Cart"
7. Views cart summary in sidebar
8. Adjusts quantities if needed
9. Clicks "Checkout"
10. Fills shipping information
11. Selects payment method
12. Reviews order summary
13. Confirms and places order
14. Receives order confirmation
15. Can track order status

**Current Status**: 
- ✅ Steps 1-8 (Frontend only)
- ⏳ Steps 9-15 (TODO)

### 6.3 Seller Onboarding Flow (Phase 2)
1. User navigates to "Sell on Thrift Clothing"
2. Registers as seller (additional verification)
3. Uploads product photos
4. Fills product details (name, description, price, condition, size)
5. Sets quantity and shipping options
6. Submits for review
7. Product approved by admin
8. Listed on marketplace
9. Receives notifications on sales
10. Ships item to buyer
11. Receives payout

**Current Status**: ❌ Not Implemented

---

## 7. Design System

### 7.1 Color Palette

#### Dark Mode (Default)
```css
--bg: #0b0b0c           /* Primary background */
--surface: #0f1116       /* Card backgrounds */
--surface-2: #12141b     /* Secondary surfaces */
--elev: #171a23          /* Elevated elements */
--text: #e5e7eb          /* Primary text */
--muted: #9aa3b2         /* Secondary text */
--brand: #d4a574         /* Primary brand color (golden) */
--brand-2: #b37a45       /* Secondary brand color */
--line: #232634          /* Borders & dividers */
--danger: #ef4444        /* Error/delete actions */
--success: #22c55e       /* Success states */
--warning: #f59e0b       /* Warning states */
```

#### Light Mode
```css
--bg: #ffffff           /* Primary background */
--surface: #f9fafb       /* Card backgrounds */
--surface-2: #f3f4f6     /* Secondary surfaces */
--elev: #ffffff          /* Elevated elements */
--text: #111827          /* Primary text */
--muted: #6b7280         /* Secondary text */
--brand: #d4a574         /* Primary brand color (golden) */
--brand-2: #b37a45       /* Secondary brand color */
--line: #e5e7eb          /* Borders & dividers */
--danger: #ef4444        /* Error/delete actions */
--success: #22c55e       /* Success states */
--warning: #f59e0b       /* Warning states */
```

**Theme Toggle**: Available in Settings modal, persists user preference via localStorage.

### 7.2 Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 800 weight, tight letter-spacing
- **Body**: 400-500 weight
- **Labels**: 600-700 weight, uppercase, 0.3px letter-spacing

### 7.3 Component Library
- **Buttons**: Rounded (8px), gradient brand colors, hover effects
- **Cards**: Dark surfaces with border, hover elevation
- **Modals**: Centered overlay, blur backdrop, slide-up animation
- **Forms**: Dark inputs, focus brand color border
- **Notifications**: Alert banners with icon, auto-dismiss

### 7.4 Responsive Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

---

## 8. Success Metrics (KPIs)

### 8.1 User Acquisition
- **Target**: 1,000 registered users in first 3 months
- **Metric**: New user signups per week
- **Goal**: 15% month-over-month growth

### 8.2 Engagement
- **Target**: 60% user return rate within 30 days
- **Metric**: Daily/weekly active users
- **Goal**: Average 5+ page views per session

### 8.3 Conversion
- **Target**: 5% cart-to-purchase conversion rate
- **Metric**: Orders placed / Cart creations
- **Goal**: Increase to 10% by month 6

### 8.4 Revenue
- **Target**: ₱100,000 GMV (Gross Merchandise Value) in first 3 months
- **Metric**: Total transaction value
- **Goal**: 25% month-over-month growth

### 8.5 Satisfaction
- **Target**: 4.5+ star average rating
- **Metric**: User reviews and feedback
- **Goal**: <2% return/complaint rate

---

## 9. Risk Assessment

### 9.1 Technical Risks
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Security vulnerabilities (SQL injection, XSS) | High | Medium | Regular security audits, input sanitization, prepared statements |
| Database performance at scale | Medium | High | Implement caching, optimize queries, consider database indexing |
| Payment gateway integration issues | High | Medium | Thorough testing, partner with reliable providers |
| Server downtime | High | Low | Use reliable hosting, implement monitoring, backup systems |

### 9.2 Business Risks
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Low seller adoption | High | Medium | Marketing campaigns, incentivize early sellers, competitive commission rates |
| Product authenticity concerns | High | Medium | Strict verification process, quality checks, buyer protection policy |
| Competition from established platforms | Medium | High | Focus on niche (sustainability), superior UX, community building |
| Payment fraud | High | Low | Fraud detection systems, secure payment processing, user verification |

### 9.3 Operational Risks
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Customer service overflow | Medium | Medium | FAQ section, chatbot support, hire support team as scaled |
| Return/refund disputes | Medium | High | Clear return policy, condition ratings, photo evidence |
| Shipping delays | Medium | Medium | Partner with reliable couriers, set clear expectations |

---

## 10. Timeline & Roadmap

### 🎓 College Project Timeline (MVP Focus)

### Phase 1: MVP Completion (4-6 Weeks for College Submission)

**Week 1-2**: Core Features & Database
- ✅ Complete database schema (users, products, orders, order_items)
- ✅ Theme system (Dark/Light mode with toggle)
- ⏳ Seed database with sample products
- ⏳ Connect products to backend API
- ⏳ Implement shopping cart functionality (add, update, remove)
- ⏳ Cart persistence (localStorage)
- ⏳ Implement product detail view

**Week 3-4**: Checkout & Payment Flow
- ⏳ Build checkout page with shipping form
- ⏳ Implement simple payment simulation
- ⏳ Create order.php API endpoints
- ⏳ Order creation and storage
- ⏳ Order confirmation page
- ⏳ Order history display

**Week 5**: Polish & Testing
- ⏳ Product search functionality
- ⏳ Dynamic filtering system
- ⏳ Bug fixes and improvements
- ⏳ Responsive design fixes
- ⏳ Cross-browser testing

**Week 6**: Documentation & Presentation
- ⏳ User manual/documentation
- ⏳ Code documentation
- ⏳ Project presentation slides
- ⏳ Demo video recording (optional)
- ⏳ Final testing and deployment

---

### 📋 College Project Deliverables Checklist

**Required for Submission:**
- [ ] Complete source code (organized folders)
- [ ] Database export (.sql file)
- [ ] README.md with setup instructions
- [ ] User manual/documentation
- [ ] Project report (features, architecture, screenshots)
- [ ] Presentation slides
- [ ] Working demo (local or hosted)

**Optional Enhancements (Extra Credit):**
- [ ] Demo video walkthrough
- [ ] API documentation (Postman collection)
- [ ] Test cases documentation
- [ ] Future roadmap/improvements section

---

### Phase 2: Enhanced Features (Post-Graduation - Optional) 🎓
*This phase is beyond college project scope*
**Week 1-2**: Core Features
- ✅ Complete database schema
- ⏳ Connect products to backend API
- ⏳ Implement product detail view
- ⏳ Add cart persistence

**Week 3-4**: Checkout Flow
- ⏳ Build checkout page
- ⏳ Implement order creation API
- ⏳ Order confirmation & history
- ⏳ Email notifications

**Week 5-6**: Search & Filters
- ⏳ Product search functionality
- ⏳ Dynamic filtering system
- ⏳ Sorting implementation

**Week 7-8**: Testing & Launch Prep
- ⏳ End-to-end testing
- ⏳ Bug fixes and optimization
- ⏳ Security audit
- ⏳ Soft launch to beta users

### Phase 2: Enhanced Features (Month 3-6)
- Seller functionality
- Product recommendations
- Reviews & ratings system
- Payment gateway integration
- Mobile responsive optimization
- Marketing & user acquisition

### Phase 3: Scale & Expand (Month 7-12)
- Mobile app development
- AI-powered features
- Admin dashboard
- Analytics & reporting
- International expansion
- Partnership programs

---

## 11. Compliance & Legal

### 11.1 Data Privacy
- Comply with Data Privacy Act of 2012 (Philippines)
- GDPR compliance for international users
- Clear privacy policy
- User consent for data collection
- Right to data deletion

### 11.2 E-Commerce Regulations
- Consumer Act of the Philippines compliance
- Clear refund and return policies
- Accurate product descriptions
- Secure payment processing
- Business registration and permits

### 11.3 Terms & Conditions
- User agreement
- Seller terms
- Prohibited items policy
- Dispute resolution process
- Intellectual property rights

---

## 12. Support & Documentation

### 12.1 User Documentation
- Getting started guide
- How to buy guide
- How to sell guide (Phase 2)
- FAQ section
- Video tutorials

### 12.2 Developer Documentation
- API documentation
- Database schema documentation
- Setup & deployment guide
- Contributing guidelines
- Code style guide

### 12.3 Customer Support
- Email support: support@thriftclothing.com
- Response time: < 24 hours
- Live chat (Phase 2)
- Help center with articles
- Community forum (Phase 3)

---

## 13. Appendix

### 13.1 College Project Considerations

#### Why This Stack?
- **PHP + MySQL**: Widely taught in web development courses
- **Vanilla JavaScript**: Demonstrates core JS knowledge without framework dependency
- **XAMPP**: Easy local development setup for presentation
- **No external dependencies**: Works offline, easy for instructors to review

#### Project Scope Justification
This project demonstrates:
- ✅ **Full-stack development** (Frontend + Backend + Database)
- ✅ **RESTful API design** and consumption
- ✅ **User authentication** with JWT
- ✅ **CRUD operations** (Create, Read, Update, Delete)
- ✅ **E-commerce flow** (Browse → Cart → Checkout → Order)
- ✅ **Payment simulation** (understanding payment gateway concepts)
- ✅ **Responsive design** (mobile-friendly interface)
- ✅ **State management** (cart, user session)
- ✅ **Form validation** (client and server-side)
- ✅ **Security basics** (password hashing, SQL injection prevention)

#### Presentation Tips
1. **Start with the problem**: Fast fashion waste and affordability
2. **Demo the user flow**: Registration → Browse → Add to cart → Checkout
3. **Highlight technical achievements**: Authentication, API integration, payment flow
4. **Show the database**: Explain table relationships and schema design
5. **Discuss challenges**: What problems you solved and how
6. **Future improvements**: What you would add given more time

#### Common Questions (Preparation)
- **Q**: "Why didn't you use React/Vue?"
  - **A**: Wanted to demonstrate core JavaScript fundamentals without framework abstraction
  
- **Q**: "Is the payment system real?"
  - **A**: It's a simulation for educational purposes, demonstrating understanding of payment flow concepts
  
- **Q**: "How do you handle security?"
  - **A**: Password hashing, prepared statements, JWT authentication, input sanitization
  
- **Q**: "Can this scale?"
  - **A**: Current architecture is for demonstration; scaling would require caching, load balancing, and optimization

---

### 13.2 Competitor Analysis
| Platform | Strengths | Weaknesses | Our Advantage |
|----------|-----------|------------|---------------|
| Carousell | Large user base, mobile-first | Generic marketplace, no curation | Specialized in fashion, quality verification |
| Shopee/Lazada | Established, wide reach | Not focused on secondhand | Sustainability focus, curated items |
| Instagram Shops | Social integration | No buyer protection | Secure transactions, return policy |
| Physical Thrift Stores | Tactile shopping | Limited inventory, location-bound | Larger inventory, convenience |

### 13.2 Market Research
- Philippines secondhand fashion market growing 15% annually
- 67% of millennials willing to buy secondhand
- Average savings of 60-70% vs retail
- Environmental concerns driving 45% of purchases

### 13.3 Market Research
- Philippines secondhand fashion market growing 15% annually
- 67% of millennials willing to buy secondhand
- Average savings of 60-70% vs retail
- Environmental concerns driving 45% of purchases

---

### 13.4 Setup Instructions (For Instructors/Reviewers)

#### Prerequisites
- XAMPP (PHP 7.4+ and MySQL 5.7+)
- Web browser (Chrome, Firefox, or Edge)
- Text editor (optional, for code review)

#### Installation Steps
1. **Install XAMPP** and start Apache and MySQL
2. **Clone/Copy project** to `C:/xampp/htdocs/thrift-clothing/`
3. **Import database**:
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create database: `thrift_clothing`
   - Import `database.sql` file
4. **Configure database** (if needed):
   - Edit `config.php` with database credentials
5. **Access application**:
   - Open browser: `http://localhost/thrift-clothing/LandingPage.html`
6. **Test accounts** (if provided):
   - Email: test@example.com
   - Password: Test1234!

#### Test Cards for Payment Demo
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Expiry**: Any future date (MM/YY)
- **CVC**: Any 3 digits

---

### 13.5 Future Considerations
- Subscription model for frequent buyers
- White-label platform for thrift stores
- B2B partnerships with fashion brands
- Sustainability certification program
- AR/VR virtual try-on features

---

## 15. Document Control
- **Version**: 1.0 (College Project Edition)
- **Last Updated**: January 2025
- **Owner**: Product Team / Student Developer
- **Status**: Living Document (MVP Focus)
- **Project Type**: Academic/Educational
- **Next Review**: After Phase 1 completion

---

## 🎓 Academic Integrity Note

This PRD represents an original e-commerce platform design for educational purposes. All code, design, and documentation are created as part of a college project to demonstrate web development skills and understanding of e-commerce systems.

**Key Learning Objectives Met:**
- Full-stack web application development
- Database design and implementation
- RESTful API architecture
- User authentication and authorization
- E-commerce business logic
- Payment flow understanding
- Security best practices
- Responsive web design

---

**End of PRD**