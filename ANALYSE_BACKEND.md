# Analyse du Backend - Système de Gestion de Stages

## 1. Vue d'Ensemble

Le backend est une application Spring Boot utilisant:
- **Framework**: Spring Boot 3.x avec Spring Security
- **Base de données**: MySQL
- **ORM**: Hibernate/JPA
- **Sécurité**: JWT (JSON Web Tokens)
- **Architecture**: REST API

---

## 2. Structure Actuelle de la Base de Données

### 2.1 Schéma Actuel

#### Tables Principales:
1. **users** - Utilisateurs (Admin, Encadreur, Stagiaire)
2. **encadreurs** - Informations spécifiques aux encadreurs
3. **interns** - Informations spécifiques aux stagiaires
4. **projects** - Projets de stage
5. **tasks** - Tâches liées aux projets
6. **notifications** - Notifications système
7. **activity_history** - Historique des actions

### 2.2 Problèmes Identifiés

#### a) Redondance des Données
- Le champ `department` est répété dans plusieurs tables (users, interns, encadreurs, projects)
- Le champ `school` est une chaîne de caractères libre, ce qui crée des doublons

#### b) Manque de Normalisation
- Pas de table de référence pour les départements
- Pas de table de référence pour les écoles
- Violation de la 3NF (dépendances transitives)

#### c) Intégrité Référentielle
- Relations faibles entre certaines entités
- Pas de gestion des contraintes d'unicité complexes

#### d) Performance
- Manque d'index sur les colonnes fréquemment interrogées
- Pas de vues pour simplifier les requêtes complexes

---

## 3. Nouvelle Structure Normalisée (3NF)

### 3.1 Principes Appliqués

#### 1ère Forme Normale (1NF)
✅ Toutes les colonnes contiennent des valeurs atomiques
✅ Clés primaires définies pour chaque table
✅ Pas de groupes répétés

#### 2ème Forme Normale (2NF)
✅ Respect de la 1NF
✅ Élimination des dépendances partielles
✅ Tous les attributs non-clés dépendent de la clé primaire complète

#### 3ème Forme Normale (3NF)
✅ Respect de la 2NF
✅ Élimination des dépendances transitives
✅ Séparation des entités distinctes en tables dédiées

### 3.2 Nouvelles Tables

#### 1. **departments** (Nouveau)
```sql
- id (PK)
- name (UNIQUE)
- code (UNIQUE)
- description
- is_active
- timestamps
```
**Objectif**: Référentiel centralisé des départements, élimine la redondance

#### 2. **schools** (Nouveau)
```sql
- id (PK)
- name (UNIQUE)
- code (UNIQUE)
- city
- country
- type (ENUM)
- timestamps
```
**Objectif**: Référentiel des établissements d'enseignement

#### 3. **evaluations** (Nouveau)
```sql
- id (PK)
- intern_id (FK)
- evaluator_id (FK)
- evaluation_date
- technical_skills_score
- soft_skills_score
- attendance_score
- overall_score (calculé automatiquement)
- comments
- timestamps
```
**Objectif**: Système d'évaluation structuré des stagiaires

#### 4. **documents** (Nouveau)
```sql
- id (PK)
- entity_type (ENUM)
- entity_id
- uploaded_by_user_id (FK)
- document_type (ENUM)
- file_name
- file_path
- file_size_kb
- mime_type
- description
- created_at
```
**Objectif**: Gestion centralisée des documents (CV, rapports, etc.)

### 3.3 Tables Modifiées

#### **encadreurs**
Avant:
```sql
department VARCHAR(100)
```
Après:
```sql
department_id BIGINT (FK -> departments.id)
max_interns INT
current_interns_count INT
is_available BOOLEAN
```

#### **interns**
Avant:
```sql
school VARCHAR(255)
department VARCHAR(100)
```
Après:
```sql
school_id BIGINT (FK -> schools.id)
department_id BIGINT (FK -> departments.id)
academic_level ENUM
major VARCHAR(255)
evaluation_score DECIMAL(4,2)
```

#### **projects**
Avant:
```sql
department VARCHAR(100)
```
Après:
```sql
department_id BIGINT (FK -> departments.id)
budget DECIMAL(10,2)
```

#### **tasks**
Amélioration:
```sql
created_by_user_id BIGINT (FK)
estimated_hours DECIMAL(5,2)
actual_hours DECIMAL(5,2)
completed_at TIMESTAMP
```

---

## 4. Améliorations Clés

### 4.1 Vues SQL pour Simplifier les Requêtes

#### **view_encadreurs_full**
Join automatique entre users, encadreurs et departments
```sql
SELECT e.*, u.email, u.first_name, d.name AS department_name
FROM encadreurs e
INNER JOIN users u ON e.user_id = u.id
INNER JOIN departments d ON e.department_id = d.id
```

#### **view_interns_full**
Join automatique entre interns, users, schools, departments, encadreurs et projects

#### **view_department_stats**
Statistiques agrégées par département (nombre d'encadreurs, stagiaires, projets)

### 4.2 Triggers pour l'Intégrité des Données

#### **trg_after_intern_insert/update/delete**
Maintient automatiquement le compteur `current_interns_count` dans la table `encadreurs`

#### **trg_before_evaluation_insert/update**
Calcule automatiquement le `overall_score` à partir des trois notes partielles

### 4.3 Index Optimisés

#### Index Simples:
- `idx_email` sur users.email
- `idx_role` sur users.role
- `idx_status` sur diverses tables

#### Index Composites:
- `idx_interns_status_dates` sur (status, start_date, end_date)
- `idx_projects_status_dates` sur (status, start_date, end_date)
- `idx_tasks_project_status` sur (project_id, status)
- `idx_notifications_user_read` sur (user_id, is_read)

---

## 5. Endpoints API Existants

### 5.1 Authentification (`/api/auth`)
- `POST /init-admin` - Créer l'admin par défaut
- `POST /login` - Connexion
- `POST /check-email` - Vérifier si email existe
- `POST /create-password` - Créer mot de passe
- `POST /register/admin` - Créer admin
- `POST /register/encadreur` - Créer encadreur
- `POST /register/stagiaire` - Créer stagiaire

### 5.2 Encadreurs (`/api/encadreurs`)
- `GET /` - Liste tous les encadreurs
- `GET /{id}` - Détails d'un encadreur
- `PUT /{id}` - Mettre à jour
- `DELETE /{id}` - Supprimer

### 5.3 Stagiaires (`/api/interns`)
- `POST /` - Créer stagiaire
- `GET /` - Liste tous les stagiaires
- `GET /{id}` - Détails d'un stagiaire
- `PUT /{id}` - Mettre à jour
- `DELETE /{id}` - Supprimer

### 5.4 Projets (`/api/projects`)
- `POST /` - Créer projet
- `GET /` - Liste tous les projets
- `GET /{id}` - Détails d'un projet
- `PUT /{id}` - Mettre à jour
- `DELETE /{id}` - Supprimer

### 5.5 Tâches (`/api/tasks`)
- `POST /` - Créer tâche
- `GET /` - Liste toutes les tâches
- `GET /{id}` - Détails d'une tâche
- `PUT /{id}` - Mettre à jour
- `DELETE /{id}` - Supprimer

### 5.6 Dashboard (`/api/dashboard`)
- `GET /metrics` - Métriques globales

### 5.7 Notifications (`/api/notifications`)
- `GET /` - Liste des notifications
- `GET /{id}` - Détails notification
- `PUT /{id}/read` - Marquer comme lu

### 5.8 Activités (`/api/activities`)
- `GET /` - Historique des activités

---

## 6. Recommandations d'Implémentation

### 6.1 Migration Progressive

1. **Phase 1**: Créer les nouvelles tables (departments, schools, evaluations, documents)
2. **Phase 2**: Migrer les données existantes
3. **Phase 3**: Modifier les entités JPA
4. **Phase 4**: Adapter les services et contrôleurs
5. **Phase 5**: Tester et valider

### 6.2 Nouvelles Entités JPA à Créer

```java
@Entity
@Table(name = "departments")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    // ... autres champs
}

@Entity
@Table(name = "schools")
public class School {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    // ... autres champs
}
```

### 6.3 Modifications des Entités Existantes

```java
// Encadreur.java
@ManyToOne
@JoinColumn(name = "department_id", nullable = false)
private Department department;

private Integer maxInterns = 5;
private Integer currentInternsCount = 0;
private Boolean isAvailable = true;

// Intern.java
@ManyToOne
@JoinColumn(name = "school_id", nullable = false)
private School school;

@ManyToOne
@JoinColumn(name = "department_id", nullable = false)
private Department department;

@Enumerated(EnumType.STRING)
private AcademicLevel academicLevel;

private String major;
```

---

## 7. Tests Postman

### 7.1 Structure de la Collection

1. **Initialisation & Authentification** (4 tests)
2. **Gestion des Encadreurs** (4 tests CRUD)
3. **Gestion des Stagiaires** (6 tests)
4. **Gestion des Projets** (6 tests)
5. **Gestion des Tâches** (7 tests)
6. **Dashboard & Statistiques** (1 test)
7. **Notifications** (2 tests)
8. **Historique des Activités** (2 tests)
9. **Tests de Sécurité** (4 tests)
10. **Tests de Performance** (2 tests)

**Total: 38 requêtes de test**

### 7.2 Variables d'Environnement

- `baseUrl`: http://localhost:8080
- `token`: JWT token (auto-généré)
- `adminUserId`: ID de l'admin
- `encadreurId`: ID de l'encadreur de test
- `internId`: ID du stagiaire de test
- `projectId`: ID du projet de test
- `taskId`: ID de la tâche de test

### 7.3 Scripts de Test Automatiques

Chaque requête inclut des scripts de test:
- Vérification du code HTTP
- Validation de la structure de réponse
- Assertions sur les données
- Sauvegarde automatique des IDs pour les requêtes suivantes

---

## 8. Avantages de la Nouvelle Structure

### 8.1 Normalisation
✅ Élimination de la redondance
✅ Cohérence des données garantie
✅ Respect de la 3NF

### 8.2 Performance
✅ Index optimisés pour les requêtes fréquentes
✅ Vues pré-calculées pour les jointures complexes
✅ Réduction de la taille de stockage

### 8.3 Maintenabilité
✅ Structure claire et logique
✅ Séparation des responsabilités
✅ Facilité d'évolution

### 8.4 Intégrité
✅ Contraintes de clés étrangères strictes
✅ Triggers pour maintenir la cohérence
✅ Validations au niveau base de données

### 8.5 Fonctionnalités
✅ Système d'évaluation des stagiaires
✅ Gestion centralisée des documents
✅ Statistiques avancées par département
✅ Suivi de disponibilité des encadreurs

---

## 9. Prochaines Étapes

1. ✅ Créer le nouveau schéma SQL normalisé
2. ✅ Générer la collection Postman complète
3. ⏳ Adapter les entités JPA Java
4. ⏳ Migrer les données existantes
5. ⏳ Mettre à jour les services métier
6. ⏳ Tester l'intégration complète
7. ⏳ Déployer en production

---

## 10. Fichiers Générés

- **`database/schema_normalized.sql`** - Nouveau schéma normalisé complet
- **`POSTMAN_COLLECTION_NORMALIZED.json`** - Collection de tests Postman
- **`ANALYSE_BACKEND.md`** - Ce document d'analyse
