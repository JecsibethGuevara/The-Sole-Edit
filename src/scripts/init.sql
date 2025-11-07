CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    deleted_at TIMESTAMP NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    brand VARCHAR(100),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE store_products (
    id SERIAL PRIMARY KEY,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(store_id, product_id)
);

CREATE INDEX idx_store_products_store ON store_products(store_id);
CREATE INDEX idx_store_products_product ON store_products(product_id);
CREATE INDEX idx_store_products_available ON store_products(store_id, is_available) WHERE is_available = true;

CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category ON products(category);

CREATE INDEX idx_stores_name ON stores(name);
CREATE INDEX idx_stores_deleted ON stores(deleted_at) WHERE deleted_at IS NULL;

ALTER TABLE store_products ALTER COLUMN is_available SET DEFAULT true;
ALTER TABLE stores ALTER COLUMN is_active SET DEFAULT true;

-- Dummy Data
-- NOTE: For password_hash, you should use a hashed password in a real application.
-- This is a placeholder.

INSERT INTO users (email, password_hash, name) VALUES
('admin@example.com', 'hashed_password_admin', 'Admin User'),
('john.doe@example.com', 'hashed_password_john', 'John Doe');

INSERT INTO stores (name, description, address, phone, email, created_by) VALUES
('Tech Gadgets', 'Your one-stop shop for the latest tech.', '123 Tech Lane, Silicon Valley', '555-1234', 'info@techgadgets.com', 1),
('Fashion Hub', 'Trendy clothes for all seasons.', '456 Style Street, Fashion City', '555-5678', 'contact@fashionhub.com', 2);

INSERT INTO products (name, description, category, brand, image_url, created_by) VALUES
('Laptop Pro', 'Powerful laptop for professionals.', 'Electronics', 'TechBrand', 'http://example.com/laptop.jpg', 1),
('Wireless Headphones', 'High-quality sound, comfortable fit.', 'Electronics', 'AudioMax', 'http://example.com/headphones.jpg', 1),
('Summer Dress', 'Light and airy dress for summer.', 'Apparel', 'ChicWear', 'http://example.com/dress.jpg', 2),
('Running Shoes', 'Comfortable shoes for your daily run.', 'Footwear', 'StrideFast', 'http://example.com/shoes.jpg', 2);

INSERT INTO store_products (store_id, product_id, price, stock, is_available) VALUES
(1, 1, 1200.00, 10, TRUE),
(1, 2, 150.00, 25, TRUE),
(2, 3, 45.00, 50, TRUE),
(2, 4, 80.00, 30, TRUE),
(1, 3, 50.00, 5, FALSE); -- Tech Gadgets also sells Summer Dress, but out of stock