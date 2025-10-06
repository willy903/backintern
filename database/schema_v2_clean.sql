-- ========================================
-- SCHEMA DE BASE DE DONNÉES - VERSION PROPRE
-- Système de Gestion de Stages
-- ========================================

DROP DATABASE IF EXISTS internship_db;
CREATE DATABASE internship_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE internship_db;

-- ========================================
-- TABLE: users
-- Stocke tous les utilisateurs du système
-- ========================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    nom VARCHAR(100),
    prenom VARCHAR(100),
    phone VARCHAR(20),
    department VARCHAR(100),
    avatar VARCHAR(500),
    role ENUM('ADMIN', 'ENCADREUR', 'STAGIAIRE') NOT NULL,
    account_status ENUM('ACTIVE', 'PENDING', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_account_status (account_status)
) ENGINE=InnoDB;

-- ========================================
-- TABLE: encadreurs
-- Informations spécifiques aux encadreurs
-- ========================================
CREATE TABLE encadreurs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    department VARCHAR(100) NOT NULL,
    specialization VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_encadreur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_encadreur_user UNIQUE (user_id),
    INDEX idx_department (department)
) ENGINE=InnoDB;

-- ========================================
-- TABLE: projects
-- Gestion des projets de stage
-- ========================================
CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    encadreur_id BIGINT,
    department VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED') DEFAULT 'PLANNING',
    progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_project_encadreur FOREIGN KEY (encadreur_id) REFERENCES encadreurs(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_department (department),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB;

-- ========================================
-- TABLE: interns
-- Informations spécifiques aux stagiaires
-- ========================================
CREATE TABLE interns (
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

    CONSTRAINT fk_intern_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_intern_encadreur FOREIGN KEY (encadreur_id) REFERENCES encadreurs(id) ON DELETE SET NULL,
    CONSTRAINT fk_intern_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    CONSTRAINT uq_intern_user UNIQUE (user_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_department (department)
) ENGINE=InnoDB;

-- ========================================
-- TABLE: tasks
-- Gestion des tâches liées aux projets
-- ========================================
CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_id BIGINT,
    assigned_to BIGINT,
    status ENUM('TODO', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'TODO',
    priority ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_task_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_task_user FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_due_date (due_date),
    INDEX idx_assigned (assigned_to)
) ENGINE=InnoDB;

-- ========================================
-- TABLE: notifications
-- Gestion des notifications utilisateurs
-- ========================================
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('INFO', 'SUCCESS', 'WARNING', 'ERROR') NOT NULL DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ========================================
-- TABLE: activity_history
-- Historique des activités système
-- ========================================
CREATE TABLE activity_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ========================================
-- DONNÉES DE TEST
-- ========================================

-- Admin par défaut (password: admin123)
INSERT INTO users (email, password, nom, prenom, role, account_status)
VALUES ('admin@example.com', '$2a$10$ZKYXmrWwFwVT4QkEeDj0xOZGz9h9VPYLRqJ5xMqNhGXp1F1YqYkae', 'Admin', 'System', 'ADMIN', 'ACTIVE');

-- Encadreur 1 (password: admin123)
INSERT INTO users (email, password, nom, prenom, phone, department, role, account_status)
VALUES ('jean.dupont@example.com', '$2a$10$ZKYXmrWwFwVT4QkEeDj0xOZGz9h9VPYLRqJ5xMqNhGXp1F1YqYkae', 'Dupont', 'Jean', '+212612345678', 'Informatique', 'ENCADREUR', 'ACTIVE');

INSERT INTO encadreurs (user_id, department, specialization)
VALUES (2, 'Informatique', 'Développement Web et Mobile');

-- Encadreur 2 (password: admin123)
INSERT INTO users (email, password, nom, prenom, phone, department, role, account_status)
VALUES ('marie.martin@example.com', '$2a$10$ZKYXmrWwFwVT4QkEeDj0xOZGz9h9VPYLRqJ5xMqNhGXp1F1YqYkae', 'Martin', 'Marie', '+212687654321', 'Informatique', 'ENCADREUR', 'ACTIVE');

INSERT INTO encadreurs (user_id, department, specialization)
VALUES (3, 'Informatique', 'Intelligence Artificielle');

-- Stagiaire en attente (pas de password - doit le créer)
INSERT INTO users (email, nom, prenom, phone, role, account_status)
VALUES ('stagiaire@example.com', 'Alami', 'Ahmed', '+212698765432', 'STAGIAIRE', 'PENDING');

INSERT INTO interns (user_id, encadreur_id, school, department, start_date, end_date, status)
VALUES (4, 1, 'Université Mohammed V', 'Informatique', '2025-01-15', '2025-06-15', 'PENDING');

-- Projet exemple
INSERT INTO projects (title, description, encadreur_id, department, start_date, end_date, status, progress)
VALUES ('Plateforme E-Commerce', 'Développement d\'une plateforme e-commerce complète', 1, 'Informatique', '2025-01-01', '2025-06-30', 'IN_PROGRESS', 25);

-- Tâches exemple
INSERT INTO tasks (title, description, project_id, assigned_to, status, priority, due_date)
VALUES
('Conception base de données', 'Créer le modèle de données', 1, 4, 'DONE', 'HIGH', '2025-01-30'),
('Développement API', 'Créer les endpoints REST', 1, 4, 'IN_PROGRESS', 'HIGH', '2025-02-28'),
('Interface utilisateur', 'Développer le frontend', 1, 4, 'TODO', 'MEDIUM', '2025-04-30');

-- ========================================
-- VUES UTILES
-- ========================================

-- Vue complète des stagiaires avec leurs encadreurs
CREATE OR REPLACE VIEW v_interns_complete AS
SELECT
    i.id AS intern_id,
    u.id AS user_id,
    u.email,
    u.nom,
    u.prenom,
    u.phone,
    u.account_status,
    i.school,
    i.department,
    i.start_date,
    i.end_date,
    i.status AS internship_status,
    i.cv,
    i.notes,
    e.id AS encadreur_id,
    eu.nom AS encadreur_nom,
    eu.prenom AS encadreur_prenom,
    eu.email AS encadreur_email,
    p.id AS project_id,
    p.title AS project_title,
    p.status AS project_status,
    i.created_at,
    i.updated_at
FROM interns i
INNER JOIN users u ON i.user_id = u.id
LEFT JOIN encadreurs e ON i.encadreur_id = e.id
LEFT JOIN users eu ON e.user_id = eu.id
LEFT JOIN projects p ON i.project_id = p.id;

-- Vue complète des encadreurs
CREATE OR REPLACE VIEW v_encadreurs_complete AS
SELECT
    e.id AS encadreur_id,
    u.id AS user_id,
    u.email,
    u.nom,
    u.prenom,
    u.phone,
    u.account_status,
    e.department,
    e.specialization,
    COUNT(DISTINCT i.id) AS total_interns,
    COUNT(DISTINCT p.id) AS total_projects,
    e.created_at,
    e.updated_at
FROM encadreurs e
INNER JOIN users u ON e.user_id = u.id
LEFT JOIN interns i ON e.id = i.encadreur_id
LEFT JOIN projects p ON e.id = p.encadreur_id
GROUP BY e.id, u.id, u.email, u.nom, u.prenom, u.phone, u.account_status,
         e.department, e.specialization, e.created_at, e.updated_at;

-- Vue des tâches avec détails
CREATE OR REPLACE VIEW v_tasks_complete AS
SELECT
    t.id AS task_id,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.due_date,
    p.id AS project_id,
    p.title AS project_title,
    u.id AS assigned_user_id,
    u.nom AS assigned_nom,
    u.prenom AS assigned_prenom,
    u.email AS assigned_email,
    t.created_at,
    t.updated_at
FROM tasks t
LEFT JOIN projects p ON t.project_id = p.id
LEFT JOIN users u ON t.assigned_to = u.id;

-- ========================================
-- STATISTIQUES RAPIDES
-- ========================================

-- Afficher les statistiques
SELECT
    'Utilisateurs' AS entite,
    COUNT(*) AS total,
    SUM(CASE WHEN account_status = 'ACTIVE' THEN 1 ELSE 0 END) AS actifs,
    SUM(CASE WHEN account_status = 'PENDING' THEN 1 ELSE 0 END) AS en_attente
FROM users
UNION ALL
SELECT
    'Stagiaires' AS entite,
    COUNT(*) AS total,
    SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) AS actifs,
    SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) AS en_attente
FROM interns
UNION ALL
SELECT
    'Projets' AS entite,
    COUNT(*) AS total,
    SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS en_cours,
    SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS completes
FROM projects;
