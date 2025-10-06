-- ============================================================================
-- SCHEMA DE BASE DE DONNÉES NORMALISÉ - SYSTÈME DE GESTION DE STAGES
-- ============================================================================
-- Version: 3.0
-- Norme: 3NF (Troisième Forme Normale)
-- SGBD: MySQL 8.0+
--
-- PRINCIPES DE NORMALISATION APPLIQUÉS:
-- - 1NF: Atomicité des colonnes, clés primaires définies
-- - 2NF: Élimination des dépendances partielles
-- - 3NF: Élimination des dépendances transitives
-- - Séparation des entités distinctes
-- - Réduction de la redondance
-- ============================================================================

CREATE DATABASE IF NOT EXISTS internship_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE internship_db;

-- ============================================================================
-- TABLE: users
-- Description: Table centrale des utilisateurs (tous les types)
-- Normalisation: Contient uniquement les attributs directement liés à l'utilisateur
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NULL COMMENT 'NULL si le compte est en attente',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    avatar_url VARCHAR(500) NULL,
    role ENUM('ADMIN', 'ENCADREUR', 'STAGIAIRE') NOT NULL,
    account_status ENUM('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (account_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Table principale des utilisateurs du système';

-- ============================================================================
-- TABLE: departments
-- Description: Référentiel des départements
-- Normalisation: Séparation des départements pour éviter la redondance
-- ============================================================================
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_code (code),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Référentiel des départements de l\'organisation';

-- ============================================================================
-- TABLE: schools
-- Description: Référentiel des établissements d'enseignement
-- Normalisation: Séparation des écoles pour éviter la duplication
-- ============================================================================
CREATE TABLE IF NOT EXISTS schools (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(50) NULL UNIQUE,
    city VARCHAR(100) NULL,
    country VARCHAR(100) NULL DEFAULT 'Morocco',
    type ENUM('UNIVERSITY', 'ENGINEERING_SCHOOL', 'BUSINESS_SCHOOL', 'TECHNICAL_SCHOOL', 'OTHER') NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_name (name),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Référentiel des établissements d\'enseignement';

-- ============================================================================
-- TABLE: encadreurs
-- Description: Informations spécifiques aux encadreurs
-- Normalisation: Séparation des attributs spécifiques aux encadreurs
-- ============================================================================
CREATE TABLE IF NOT EXISTS encadreurs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    department_id BIGINT NOT NULL,
    specialization VARCHAR(255) NULL,
    max_interns INT NOT NULL DEFAULT 5 COMMENT 'Nombre maximum de stagiaires supervisés simultanément',
    current_interns_count INT NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    UNIQUE KEY uk_user_encadreur (user_id),
    INDEX idx_department (department_id),
    INDEX idx_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Informations spécifiques aux encadreurs';

-- ============================================================================
-- TABLE: projects
-- Description: Projets de stage
-- Normalisation: Contient uniquement les attributs du projet
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    department_id BIGINT NOT NULL,
    encadreur_id BIGINT NULL COMMENT 'Encadreur responsable du projet',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED') NOT NULL DEFAULT 'PLANNING',
    progress_percentage INT NOT NULL DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    budget DECIMAL(10, 2) NULL COMMENT 'Budget alloué au projet',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    FOREIGN KEY (encadreur_id) REFERENCES encadreurs(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_department (department_id),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_encadreur (encadreur_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Projets de stage';

-- ============================================================================
-- TABLE: interns
-- Description: Informations spécifiques aux stagiaires
-- Normalisation: Séparation des attributs spécifiques aux stagiaires
-- ============================================================================
CREATE TABLE IF NOT EXISTS interns (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    school_id BIGINT NOT NULL,
    department_id BIGINT NOT NULL,
    encadreur_id BIGINT NULL,
    project_id BIGINT NULL,
    academic_level ENUM('LICENSE', 'MASTER', 'DOCTORATE', 'ENGINEERING', 'OTHER') NOT NULL,
    major VARCHAR(255) NOT NULL COMMENT 'Spécialité/Filière',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',
    cv_path VARCHAR(500) NULL,
    notes TEXT NULL,
    evaluation_score DECIMAL(4, 2) NULL CHECK (evaluation_score BETWEEN 0 AND 20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE RESTRICT,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    FOREIGN KEY (encadreur_id) REFERENCES encadreurs(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    UNIQUE KEY uk_user_intern (user_id),
    INDEX idx_status (status),
    INDEX idx_school (school_id),
    INDEX idx_department (department_id),
    INDEX idx_encadreur (encadreur_id),
    INDEX idx_project (project_id),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Informations spécifiques aux stagiaires';

-- ============================================================================
-- TABLE: tasks
-- Description: Tâches assignées aux projets
-- Normalisation: Séparation complète des tâches
-- ============================================================================
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    assigned_to_user_id BIGINT NULL COMMENT 'Utilisateur assigné (peut être stagiaire ou encadreur)',
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status ENUM('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'CANCELLED') NOT NULL DEFAULT 'TODO',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
    estimated_hours DECIMAL(5, 2) NULL,
    actual_hours DECIMAL(5, 2) NULL,
    due_date DATE NULL,
    completed_at TIMESTAMP NULL,
    created_by_user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_project (project_id),
    INDEX idx_assigned (assigned_to_user_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tâches liées aux projets';

-- ============================================================================
-- TABLE: notifications
-- Description: Système de notifications
-- Normalisation: Table dédiée aux notifications
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT 'Destinataire de la notification',
    type ENUM('INFO', 'WARNING', 'SUCCESS', 'ERROR', 'TASK_ASSIGNED', 'PROJECT_UPDATE', 'DEADLINE') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    reference_type ENUM('PROJECT', 'TASK', 'INTERN', 'USER') NULL,
    reference_id BIGINT NULL COMMENT 'ID de l\'entité référencée',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_type (type),
    INDEX idx_created (created_at),
    INDEX idx_reference (reference_type, reference_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Notifications utilisateurs';

-- ============================================================================
-- TABLE: activity_history
-- Description: Historique des actions
-- Normalisation: Audit trail séparé
-- ============================================================================
CREATE TABLE IF NOT EXISTS activity_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT 'Utilisateur ayant effectué l\'action',
    action_type ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'ASSIGN', 'COMPLETE') NOT NULL,
    entity_type ENUM('USER', 'PROJECT', 'TASK', 'INTERN', 'ENCADREUR', 'DEPARTMENT') NOT NULL,
    entity_id BIGINT NOT NULL COMMENT 'ID de l\'entité concernée',
    description TEXT NOT NULL,
    ip_address VARCHAR(45) NULL COMMENT 'Adresse IP de l\'utilisateur',
    user_agent TEXT NULL COMMENT 'User agent du navigateur',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_action (action_type),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Historique des activités et actions utilisateurs';

-- ============================================================================
-- TABLE: documents
-- Description: Gestion des documents (CV, rapports, etc.)
-- Normalisation: Séparation des documents
-- ============================================================================
CREATE TABLE IF NOT EXISTS documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_type ENUM('INTERN', 'PROJECT', 'TASK') NOT NULL,
    entity_id BIGINT NOT NULL,
    uploaded_by_user_id BIGINT NOT NULL,
    document_type ENUM('CV', 'REPORT', 'CONTRACT', 'EVALUATION', 'OTHER') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_kb INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_type (document_type),
    INDEX idx_uploaded_by (uploaded_by_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Gestion des documents attachés';

-- ============================================================================
-- TABLE: evaluations
-- Description: Évaluations des stagiaires
-- Normalisation: Séparation des évaluations
-- ============================================================================
CREATE TABLE IF NOT EXISTS evaluations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    intern_id BIGINT NOT NULL,
    evaluator_id BIGINT NOT NULL COMMENT 'Encadreur qui évalue',
    evaluation_date DATE NOT NULL,
    technical_skills_score DECIMAL(4, 2) NOT NULL CHECK (technical_skills_score BETWEEN 0 AND 20),
    soft_skills_score DECIMAL(4, 2) NOT NULL CHECK (soft_skills_score BETWEEN 0 AND 20),
    attendance_score DECIMAL(4, 2) NOT NULL CHECK (attendance_score BETWEEN 0 AND 20),
    overall_score DECIMAL(4, 2) NOT NULL CHECK (overall_score BETWEEN 0 AND 20),
    comments TEXT NULL,
    strengths TEXT NULL,
    areas_for_improvement TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (intern_id) REFERENCES interns(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluator_id) REFERENCES encadreurs(id) ON DELETE RESTRICT,
    INDEX idx_intern (intern_id),
    INDEX idx_evaluator (evaluator_id),
    INDEX idx_date (evaluation_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Évaluations des performances des stagiaires';

-- ============================================================================
-- DONNÉES INITIALES
-- ============================================================================

-- Insertion des départements par défaut
INSERT INTO departments (name, code, description) VALUES
('Informatique', 'IT', 'Département des Technologies de l\'Information'),
('Ressources Humaines', 'RH', 'Département des Ressources Humaines'),
('Finance', 'FIN', 'Département Financier'),
('Marketing', 'MKT', 'Département Marketing'),
('Ingénierie', 'ENG', 'Département Ingénierie'),
('Recherche & Développement', 'RD', 'Département R&D')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Insertion des écoles par défaut
INSERT INTO schools (name, code, city, type) VALUES
('École Nationale Supérieure d\'Informatique et d\'Analyse des Systèmes', 'ENSIAS', 'Rabat', 'ENGINEERING_SCHOOL'),
('Université Mohammed V', 'UM5', 'Rabat', 'UNIVERSITY'),
('École Mohammadia d\'Ingénieurs', 'EMI', 'Rabat', 'ENGINEERING_SCHOOL'),
('ENSA', 'ENSA', 'Casablanca', 'ENGINEERING_SCHOOL'),
('HEM Business School', 'HEM', 'Casablanca', 'BUSINESS_SCHOOL')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Création du compte admin par défaut
-- Mot de passe: Admin@2024
INSERT INTO users (email, password, first_name, last_name, phone, role, account_status)
VALUES (
    'admin@internship.com',
    '$2a$10$ZKYXmrWwFwVT4QkEeDj0xOZGz9h9VPYLRqJ5xMqNhGXp1F1YqYkae',
    'Admin',
    'System',
    '+212600000000',
    'ADMIN',
    'ACTIVE'
)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- ============================================================================
-- VUES POUR SIMPLIFIER LES REQUÊTES
-- ============================================================================

-- Vue: Informations complètes des encadreurs
CREATE OR REPLACE VIEW view_encadreurs_full AS
SELECT
    e.id,
    e.user_id,
    u.email,
    u.first_name,
    u.last_name,
    u.phone,
    u.avatar_url,
    u.account_status,
    d.name AS department_name,
    d.code AS department_code,
    e.specialization,
    e.max_interns,
    e.current_interns_count,
    e.is_available,
    e.created_at,
    e.updated_at
FROM encadreurs e
INNER JOIN users u ON e.user_id = u.id
INNER JOIN departments d ON e.department_id = d.id;

-- Vue: Informations complètes des stagiaires
CREATE OR REPLACE VIEW view_interns_full AS
SELECT
    i.id,
    i.user_id,
    u.email,
    u.first_name,
    u.last_name,
    u.phone,
    u.avatar_url,
    u.account_status,
    s.name AS school_name,
    d.name AS department_name,
    i.academic_level,
    i.major,
    i.start_date,
    i.end_date,
    i.status,
    i.evaluation_score,
    e.id AS encadreur_id,
    CONCAT(ue.first_name, ' ', ue.last_name) AS encadreur_name,
    p.id AS project_id,
    p.title AS project_title,
    i.created_at,
    i.updated_at
FROM interns i
INNER JOIN users u ON i.user_id = u.id
INNER JOIN schools s ON i.school_id = s.id
INNER JOIN departments d ON i.department_id = d.id
LEFT JOIN encadreurs e ON i.encadreur_id = e.id
LEFT JOIN users ue ON e.user_id = ue.id
LEFT JOIN projects p ON i.project_id = p.id;

-- Vue: Statistiques par département
CREATE OR REPLACE VIEW view_department_stats AS
SELECT
    d.id,
    d.name,
    d.code,
    COUNT(DISTINCT e.id) AS total_encadreurs,
    COUNT(DISTINCT i.id) AS total_interns,
    COUNT(DISTINCT CASE WHEN i.status = 'ACTIVE' THEN i.id END) AS active_interns,
    COUNT(DISTINCT p.id) AS total_projects,
    COUNT(DISTINCT CASE WHEN p.status = 'IN_PROGRESS' THEN p.id END) AS active_projects
FROM departments d
LEFT JOIN encadreurs e ON d.id = e.department_id
LEFT JOIN interns i ON d.id = i.department_id
LEFT JOIN projects p ON d.id = p.department_id
GROUP BY d.id, d.name, d.code;

-- ============================================================================
-- TRIGGERS POUR MAINTENIR L'INTÉGRITÉ DES DONNÉES
-- ============================================================================

-- Trigger: Mettre à jour le compteur d'encadrés
DELIMITER $$

CREATE TRIGGER IF NOT EXISTS trg_after_intern_insert
AFTER INSERT ON interns
FOR EACH ROW
BEGIN
    IF NEW.encadreur_id IS NOT NULL THEN
        UPDATE encadreurs
        SET current_interns_count = current_interns_count + 1,
            is_available = (current_interns_count + 1 < max_interns)
        WHERE id = NEW.encadreur_id;
    END IF;
END$$

CREATE TRIGGER IF NOT EXISTS trg_after_intern_update
AFTER UPDATE ON interns
FOR EACH ROW
BEGIN
    -- Décrémenter l'ancien encadreur
    IF OLD.encadreur_id IS NOT NULL AND OLD.encadreur_id != NEW.encadreur_id THEN
        UPDATE encadreurs
        SET current_interns_count = GREATEST(current_interns_count - 1, 0),
            is_available = (current_interns_count - 1 < max_interns)
        WHERE id = OLD.encadreur_id;
    END IF;

    -- Incrémenter le nouvel encadreur
    IF NEW.encadreur_id IS NOT NULL AND OLD.encadreur_id != NEW.encadreur_id THEN
        UPDATE encadreurs
        SET current_interns_count = current_interns_count + 1,
            is_available = (current_interns_count + 1 < max_interns)
        WHERE id = NEW.encadreur_id;
    END IF;
END$$

CREATE TRIGGER IF NOT EXISTS trg_after_intern_delete
AFTER DELETE ON interns
FOR EACH ROW
BEGIN
    IF OLD.encadreur_id IS NOT NULL THEN
        UPDATE encadreurs
        SET current_interns_count = GREATEST(current_interns_count - 1, 0),
            is_available = (current_interns_count - 1 < max_interns)
        WHERE id = OLD.encadreur_id;
    END IF;
END$$

-- Trigger: Calculer le score global lors d'une évaluation
CREATE TRIGGER IF NOT EXISTS trg_before_evaluation_insert
BEFORE INSERT ON evaluations
FOR EACH ROW
BEGIN
    SET NEW.overall_score = (
        NEW.technical_skills_score +
        NEW.soft_skills_score +
        NEW.attendance_score
    ) / 3;
END$$

CREATE TRIGGER IF NOT EXISTS trg_before_evaluation_update
BEFORE UPDATE ON evaluations
FOR EACH ROW
BEGIN
    SET NEW.overall_score = (
        NEW.technical_skills_score +
        NEW.soft_skills_score +
        NEW.attendance_score
    ) / 3;
END$$

DELIMITER ;

-- ============================================================================
-- INDEX SUPPLÉMENTAIRES POUR LES PERFORMANCES
-- ============================================================================

-- Index composites pour les requêtes fréquentes
CREATE INDEX idx_interns_status_dates ON interns(status, start_date, end_date);
CREATE INDEX idx_projects_status_dates ON projects(status, start_date, end_date);
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================
