-- Create Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(50),
    province VARCHAR(50),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Products Table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    conditions VARCHAR(20) NOT NULL,
    stock INT DEFAULT 0,
    brand VARCHAR(100),
    image_url VARCHAR(255),
    sales INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Orders Table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create Order Items Table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create Cart Table
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert Sample Products
INSERT INTO products (name, description, price, category, conditions, stock, brand) VALUES
('Classic Cotton Tee', 'Comfortable classic cotton t-shirt', 150, 'Men', 'Good', 9, 'Generic'),
('Slim Denim Jeans', 'Stylish slim fit denim jeans', 250, 'Men', 'Like New', 5, 'Levis'),
('Breezy Summer Dress', 'Light and airy summer dress', 100, 'Women', 'Good', 12, 'H&M'),
('Vintage Denim Jacket', 'Classic vintage denim jacket', 320, 'Men', 'Like New', 3, 'Levis'),
('Polo Shirt', 'Elegant polo shirt', 180, 'Men', 'Good', 7, 'Nike'),
('Casual Blazer', 'Professional casual blazer', 450, 'Women', 'Like New', 2, 'Generic'),
('Cargo Pants', 'Comfortable cargo pants', 280, 'Men', 'Good', 6, 'Generic'),
('Hoodie', 'Cozy pullover hoodie', 350, 'Unisex', 'Good', 4, 'Adidas'),
('Athletic Shorts', 'Performance athletic shorts', 120, 'Unisex', 'Good', 11, 'Nike'),
('Sweater', 'Warm knit sweater', 220, 'Unisex', 'Good', 8, 'Generic'),
('Bomber Jacket', 'Trendy bomber jacket', 380, 'Men', 'Like New', 1, 'Generic'),
('Flannel Shirt', 'Classic flannel shirt', 200, 'Men', 'Good', 10, 'Generic');