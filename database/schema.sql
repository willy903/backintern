-- Base de données pour le système de gestion de stages
-- Exécutez ce script pour créer la structure de la base de données

CREATE DATABASE IF NOT EXISTS internship_db;
USE internship_db;

-- Table des utilisateurs (base pour tous les types d'utilisateurs)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255),
    role ENUM('ADMIN', 'ENCADREUR', 'STAGIAIRE') NOT NULL,
    account_status ENUM('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',
    phone VARCHAR(20),
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des encadreurs
CREATE TABLE IF NOT EXISTS encadreurs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    department VARCHAR(100) NOT NULL,
    specialization VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_encadreur (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des projets
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    encadreur_id BIGINT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED') DEFAULT 'PLANNING',
    progress INT DEFAULT 0,
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (encadreur_id) REFERENCES encadreurs(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des stagiaires
CREATE TABLE IF NOT EXISTS interns (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    encadreur_id BIGINT,
    project_id BIGINT,
    school VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    cv VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (encadreur_id) REFERENCES encadreurs(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_intern (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des tâches
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_id BIGINT,
    assigned_to BIGINT,
    status ENUM('TODO', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'TODO',
    priority ENUM('LOW', 'MEDIUM', 'HIGH'),
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de test (optionnel)

-- Créer un admin
INSERT INTO users (email, first_name, last_name, password, role, account_status)
VALUES ('admin@example.com', 'Admin', 'System', '$2a$10$ZKYXmrWwFwVT4QkEeDj0xOZGz9h9VPYLRqJ5xMqNhGXp1F1YqYkae', 'ADMIN', 'ACTIVE');

-- Créer un encadreur
INSERT INTO users (email, first_name, last_name, password, role, account_status, phone)
VALUES ('encadreur@example.com', 'Jean', 'Dupont', '$2a$10$ZKYXmrWwFwVT4QkEeDj0xOZGz9h9VPYLRqJ5xMqNhGXp1F1YqYkae', 'ENCADREUR', 'ACTIVE', '0612345678');

INSERT INTO encadreurs (user_id, department, specialization)
VALUES (2, 'Informatique', 'Développement Web');

-- Créer un stagiaire sans mot de passe (PENDING)
INSERT INTO users (email, first_name, last_name, role, account_status, phone)
VALUES ('stagiaire@example.com', 'Marie', 'Martin', 'STAGIAIRE', 'PENDING', '0687654321');

INSERT INTO interns (user_id, encadreur_id, school, department, start_date, end_date, status)
VALUES (3, 1, 'Université Paris', 'Informatique', '2025-01-15', '2025-06-15', 'PENDING');
