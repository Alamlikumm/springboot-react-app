-- ================================================
-- Spring Boot + React Product Manager
-- Database Initialization Script
-- ================================================

-- Buat database (jalankan di phpMyAdmin atau MySQL CLI)
CREATE DATABASE IF NOT EXISTS springboot_react_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE springboot_react_db;

-- Tabel products akan otomatis dibuat oleh Hibernate (ddl-auto=update)
-- Script ini hanya untuk data sample / testing

-- Insert sample data
INSERT INTO products (name, description, price, stock, image_url, active, created_at, updated_at) VALUES
('Laptop Asus ROG Strix', 'Laptop gaming high-end dengan RTX 4060, RAM 16GB, SSD 512GB', 22500000.00, 15, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400', true, NOW(), NOW()),
('iPhone 15 Pro Max', 'Smartphone Apple terbaru dengan chip A17 Pro dan kamera 48MP', 21999000.00, 25, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', true, NOW(), NOW()),
('Samsung Galaxy S24 Ultra', 'Flagship Samsung dengan Galaxy AI, S-Pen, dan kamera 200MP', 19999000.00, 30, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', true, NOW(), NOW()),
('Sony WH-1000XM5', 'Headphone wireless premium dengan noise cancelling terbaik', 4999000.00, 50, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400', true, NOW(), NOW()),
('iPad Air M2', 'Tablet Apple dengan chip M2, layar 10.9 inch Liquid Retina', 12999000.00, 20, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', true, NOW(), NOW());
