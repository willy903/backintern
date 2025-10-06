# API Backend - Système de Gestion de Stages

Backend REST API développé avec Spring Boot pour le système de gestion de stages.

## Technologies Utilisées

- Java 17
- Spring Boot 3.2.0
- Spring Security avec JWT
- Spring Data JPA
- MySQL 8.0
- Lombok
- Maven

## Prérequis

- JDK 17 ou supérieur
- Maven 3.6+
- MySQL 8.0 ou supérieur
- Un IDE (IntelliJ IDEA, Eclipse, VS Code avec extensions Java)

## Installation et Configuration

### 1. Cloner le projet

```bash
cd spring-boot-backend
```

### 2. Configurer MySQL

Démarrez MySQL et créez la base de données :

```sql
CREATE DATABASE internship_db;
```

Ou exécutez le script complet :

```bash
mysql -u root -p < database/schema.sql
```

### 3. Configurer l'application

Modifiez `src/main/resources/application.properties` selon votre configuration MySQL :

```properties
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe
```

### 4. Compiler le projet

```bash
mvn clean install
```

### 5. Lancer l'application

```bash
mvn spring-boot:run
```

L'API sera accessible sur `http://localhost:8080/api`

## Format des Réponses API

Toutes les réponses de l'API suivent un format standardisé :

### Réponse Succès
```json
{
  "success": true,
  "message": "Message descriptif (optionnel)",
  "data": { /* données de réponse */ },
  "error": null
}
```

### Réponse Erreur
```json
{
  "success": false,
  "message": null,
  "data": null,
  "error": "Message d'erreur détaillé"
}
```

## Documentation Complète de l'API

### 🔐 Authentification

Tous les endpoints publics d'authentification ne nécessitent pas de token JWT.

#### 1. Initialiser le compte Admin par défaut

**Endpoint:** `POST /api/auth/init-admin`

**Description:** Crée le compte administrateur par défaut. À exécuter une seule fois lors de l'initialisation du système.

**Corps de la requête:**
```json
{}
```

**Réponse (201 Created):**
```json
{
  "success": true,
  "message": "Admin par défaut initialisé",
  "data": {
    "id": 1,
    "email": "admin@internship.com",
    "nom": "Admin",
    "prenom": "System",
    "phone": "+212600000000",
    "department": "IT",
    "role": "ADMIN",
    "accountStatus": "ACTIVE",
    "avatar": null
  }
}
```

**Credentials créés:**
- Email: `admin@internship.com`
- Password: `Admin@2024`

**Réponse Erreur (400):**
```json
{
  "success": false,
  "error": "Le compte admin par défaut existe déjà"
}
```

---

#### 2. Vérifier un Email

**Endpoint:** `POST /api/auth/check-email`

**Description:** Vérifie si un email existe dans le système et s'il a déjà un mot de passe.

**Corps de la requête:**
```json
{
  "email": "stagiaire@example.com"
}
```

**Réponse (200 OK) - Email existe avec mot de passe:**
```json
{
  "exists": true,
  "hasPassword": true,
  "message": "Compte déjà activé. Veuillez vous connecter."
}
```

**Réponse (200 OK) - Email existe sans mot de passe:**
```json
{
  "exists": true,
  "hasPassword": false,
  "message": "Email trouvé. Créez votre mot de passe."
}
```

**Réponse (200 OK) - Email n'existe pas:**
```json
{
  "exists": false,
  "hasPassword": false,
  "message": "Email non trouvé dans le système"
}
```

---

#### 3. Créer un Mot de Passe

**Endpoint:** `POST /api/auth/create-password`

**Description:** Permet à un utilisateur (généralement un stagiaire) de créer son mot de passe pour activer son compte.

**Corps de la requête:**
```json
{
  "email": "stagiaire@example.com",
  "password": "MonMotDePasse123!"
}
```

**Réponse (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "email": "stagiaire@example.com",
    "nom": "Martin",
    "prenom": "Marie",
    "phone": "0687654321",
    "department": "Informatique",
    "role": "STAGIAIRE",
    "accountStatus": "ACTIVE",
    "avatar": null
  }
}
```

**Réponses Erreur:**
- `400`: Email non trouvé ou compte déjà activé

---

#### 4. Se Connecter

**Endpoint:** `POST /api/auth/login`

**Description:** Authentifie un utilisateur avec email et mot de passe.

**Corps de la requête:**
```json
{
  "email": "admin@internship.com",
  "password": "Admin@2024"
}
```

**Réponse (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@internship.com",
    "nom": "Admin",
    "prenom": "System",
    "phone": "+212600000000",
    "department": "IT",
    "role": "ADMIN",
    "accountStatus": "ACTIVE",
    "avatar": null
  }
}
```

**Réponses Erreur:**
- `400`: Email ou mot de passe incorrect
- `400`: Compte non activé
- `400`: Compte désactivé

---

#### 5. Créer un Admin

**Endpoint:** `POST /api/auth/register/admin`

**Description:** Crée un nouveau compte administrateur.

**Corps de la requête:**
```json
{
  "email": "admin2@example.com",
  "password": "SecurePassword123!",
  "nom": "Dupont",
  "prenom": "Jean",
  "phone": "+212600000001",
  "departement": "IT"
}
```

**Réponse (201 Created):**
```json
{
  "success": true,
  "message": "Admin créé avec succès",
  "data": {
    "id": 2,
    "email": "admin2@example.com",
    "nom": "Dupont",
    "prenom": "Jean",
    "phone": "+212600000001",
    "department": "IT",
    "role": "ADMIN",
    "accountStatus": "ACTIVE",
    "avatar": null
  }
}
```

---

#### 6. Créer un Encadreur

**Endpoint:** `POST /api/auth/register/encadreur`

**Description:** Crée un nouveau compte encadreur (sans mot de passe initial).

**Corps de la requête:**
```json
{
  "email": "encadreur@example.com",
  "nom": "Dubois",
  "prenom": "Pierre",
  "phone": "+212600000002",
  "departement": "Informatique",
  "specialization": "Développement Web"
}
```

**Réponse (201 Created):**
```json
{
  "success": true,
  "message": "Encadreur créé avec succès",
  "data": {
    "id": 3,
    "email": "encadreur@example.com",
    "nom": "Dubois",
    "prenom": "Pierre",
    "phone": "+212600000002",
    "department": "Informatique",
    "role": "ENCADREUR",
    "accountStatus": "PENDING",
    "avatar": null
  }
}
```

---

#### 7. Créer un Stagiaire

**Endpoint:** `POST /api/auth/register/stagiaire`

**Description:** Crée un nouveau compte stagiaire (sans mot de passe initial).

**Corps de la requête:**
```json
{
  "email": "stagiaire@example.com",
  "nom": "Martin",
  "prenom": "Marie",
  "phone": "+212600000003",
  "departement": "Informatique",
  "school": "Université Paris",
  "major": "Informatique",
  "startDate": "2025-01-15",
  "endDate": "2025-06-15",
  "encadreurId": 1
}
```

**Réponse (201 Created):**
```json
{
  "success": true,
  "message": "Stagiaire créé avec succès",
  "data": {
    "id": 4,
    "email": "stagiaire@example.com",
    "nom": "Martin",
    "prenom": "Marie",
    "phone": "+212600000003",
    "department": "Informatique",
    "role": "STAGIAIRE",
    "accountStatus": "PENDING",
    "avatar": null
  }
}
```

---

### 👥 Encadreurs

**Tous les endpoints nécessitent un token JWT:** `Authorization: Bearer {token}`

#### 1. Récupérer tous les Encadreurs

**Endpoint:** `GET /api/encadreurs`

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "encadreur@example.com",
      "nom": "Dubois",
      "prenom": "Pierre",
      "phone": "+212600000002",
      "department": "Informatique",
      "role": "ENCADREUR",
      "accountStatus": "ACTIVE",
      "avatar": null
    }
  ]
}
```

---

#### 2. Récupérer un Encadreur par ID

**Endpoint:** `GET /api/encadreurs/{id}`

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "encadreur@example.com",
    "nom": "Dubois",
    "prenom": "Pierre",
    "phone": "+212600000002",
    "department": "Informatique",
    "role": "ENCADREUR",
    "accountStatus": "ACTIVE",
    "avatar": null
  }
}
```

**Réponse Erreur (404):**
```json
{
  "success": false,
  "error": "Encadreur non trouvé"
}
```

---

#### 3. Récupérer les Stagiaires d'un Encadreur

**Endpoint:** `GET /api/encadreurs/{id}/interns`

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 4,
      "email": "stagiaire@example.com",
      "nom": "Martin",
      "prenom": "Marie",
      "phone": "+212600000003",
      "school": "Université Paris",
      "department": "Informatique",
      "startDate": "2025-01-15",
      "endDate": "2025-06-15",
      "status": "ACTIVE",
      "encadreurId": 1,
      "projectId": null,
      "cv": null,
      "notes": null
    }
  ]
}
```

---

#### 4. Compter les Stagiaires d'un Encadreur

**Endpoint:** `GET /api/encadreurs/{id}/intern-count`

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": 5
}
```

---

#### 5. Modifier un Encadreur

**Endpoint:** `PUT /api/encadreurs/{id}`

**Corps de la requête:**
```json
{
  "nom": "Dubois",
  "prenom": "Pierre",
  "phone": "+212600000099",
  "department": "Ressources Humaines"
}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Encadreur mis à jour avec succès",
  "data": {
    "id": 1,
    "email": "encadreur@example.com",
    "nom": "Dubois",
    "prenom": "Pierre",
    "phone": "+212600000099",
    "department": "Ressources Humaines",
    "role": "ENCADREUR",
    "accountStatus": "ACTIVE",
    "avatar": null
  }
}
```

---

#### 6. Supprimer un Encadreur

**Endpoint:** `DELETE /api/encadreurs/{id}`

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Encadreur supprimé avec succès",
  "data": null
}
```

---

### 🎓 Stagiaires

**Tous les endpoints nécessitent un token JWT:** `Authorization: Bearer {token}`

#### 1. Créer un Stagiaire

**Endpoint:** `POST /api/interns`

**Corps de la requête:**
```json
{
  "email": "nouveau@example.com",
  "firstName": "Thomas",
  "lastName": "Bernard",
  "phone": "+212600000004",
  "school": "ENSA",
  "department": "Génie Logiciel",
  "startDate": "2025-02-01",
  "endDate": "2025-07-01",
  "encadreurId": 1
}
```

**Réponse (201 Created):**
```json
{
  "success": true,
  "message": "Stagiaire créé avec succès",
  "data": {
    "id": 2,
    "userId": 5,
    "email": "nouveau@example.com",
    "nom": "Bernard",
    "prenom": "Thomas",
    "phone": "+212600000004",
    "school": "ENSA",
    "department": "Génie Logiciel",
    "startDate": "2025-02-01",
    "endDate": "2025-07-01",
    "status": "PENDING",
    "encadreurId": 1,
    "projectId": null,
    "cv": null,
    "notes": null
  }
}
```

---

#### 2. Récupérer tous les Stagiaires

**Endpoint:** `GET /api/interns`

**Paramètres optionnels:**
- `encadreurId`: Filtrer par encadreur
- `department`: Filtrer par département
- `status`: Filtrer par statut (PENDING, ACTIVE, COMPLETED, CANCELLED)

**Exemples:**
- `GET /api/interns`
- `GET /api/interns?encadreurId=1`
- `GET /api/interns?department=Informatique`
- `GET /api/interns?status=ACTIVE`

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 4,
      "email": "stagiaire@example.com",
      "nom": "Martin",
      "prenom": "Marie",
      "phone": "+212600000003",
      "school": "Université Paris",
      "department": "Informatique",
      "startDate": "2025-01-15",
      "endDate": "2025-06-15",
      "status": "ACTIVE",
      "encadreurId": 1,
      "projectId": null,
      "cv": null,
      "notes": null
    }
  ]
}
```

---

#### 3. Récupérer un Stagiaire par ID

**Endpoint:** `GET /api/interns/{id}`

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 4,
    "email": "stagiaire@example.com",
    "nom": "Martin",
    "prenom": "Marie",
    "phone": "+212600000003",
    "school": "Université Paris",
    "department": "Informatique",
    "startDate": "2025-01-15",
    "endDate": "2025-06-15",
    "status": "ACTIVE",
    "encadreurId": 1,
    "projectId": null,
    "cv": null,
    "notes": null
  }
}
```

---

#### 4. Modifier un Stagiaire

**Endpoint:** `PUT /api/interns/{id}`

**Corps de la requête:**
```json
{
  "phone": "+212600000999",
  "school": "Nouvelle École",
  "department": "Data Science",
  "startDate": "2025-01-15",
  "endDate": "2025-08-15",
  "encadreurId": 2
}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Stagiaire mis à jour avec succès",
  "data": { /* données mises à jour */ }
}
```

---

#### 5. Mettre à jour le Statut d'un Stagiaire

**Endpoint:** `PATCH /api/interns/{id}/status`

**Corps de la requête:**
```json
{
  "status": "ACTIVE"
}
```

**Valeurs possibles:** PENDING, ACTIVE, COMPLETED, CANCELLED

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Statut mis à jour avec succès",
  "data": { /* données mises à jour */ }
}
```

---

#### 6. Supprimer un Stagiaire

**Endpoint:** `DELETE /api/interns/{id}`

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Stagiaire supprimé avec succès",
  "data": null
}
```

---

### 📋 Projets

**Tous les endpoints nécessitent un token JWT:** `Authorization: Bearer {token}`

#### 1. Récupérer tous les Projets

**Endpoint:** `GET /api/projects`

**Paramètres optionnels:**
- `encadreurId`: Filtrer par encadreur
- `stagiaireId`: Filtrer par stagiaire

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Application Mobile",
      "description": "Développement d'une app mobile",
      "encadreurId": 1,
      "startDate": "2025-01-15",
      "endDate": "2025-06-15",
      "status": "IN_PROGRESS",
      "progress": 45,
      "department": "Informatique"
    }
  ]
}
```

---

#### 2. Récupérer un Projet par ID

**Endpoint:** `GET /api/projects/{id}`

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Application Mobile",
    "description": "Développement d'une app mobile",
    "encadreurId": 1,
    "startDate": "2025-01-15",
    "endDate": "2025-06-15",
    "status": "IN_PROGRESS",
    "progress": 45,
    "department": "Informatique"
  }
}
```

---

#### 3. Créer un Projet

**Endpoint:** `POST /api/projects`

**Corps de la requête:**
```json
{
  "title": "Système de Gestion",
  "description": "Développement d'un système de gestion",
  "encadreurId": 1,
  "startDate": "2025-03-01",
  "endDate": "2025-08-01",
  "status": "PLANNING",
  "progress": 0,
  "department": "Informatique"
}
```

**Réponse (201 Created):**
```json
{
  "success": true,
  "message": "Projet créé avec succès",
  "data": {
    "id": 2,
    "title": "Système de Gestion",
    "description": "Développement d'un système de gestion",
    "encadreurId": 1,
    "startDate": "2025-03-01",
    "endDate": "2025-08-01",
    "status": "PLANNING",
    "progress": 0,
    "department": "Informatique"
  }
}
```

---

#### 4. Modifier un Projet

**Endpoint:** `PUT /api/projects/{id}`

**Corps de la requête:**
```json
{
  "title": "Système de Gestion - Mis à jour",
  "description": "Description mise à jour",
  "status": "IN_PROGRESS",
  "progress": 30
}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Projet mis à jour avec succès",
  "data": { /* données mises à jour */ }
}
```

---

#### 5. Assigner des Stagiaires à un Projet

**Endpoint:** `POST /api/projects/{id}/assign-interns`

**Corps de la requête:**
```json
{
  "internIds": [1, 2, 3]
}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Stagiaires assignés avec succès",
  "data": { /* projet mis à jour */ }
}
```

---

#### 6. Supprimer un Projet

**Endpoint:** `DELETE /api/projects/{id}`

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Projet supprimé avec succès",
  "data": null
}
```

---

### ✅ Tâches

**Tous les endpoints nécessitent un token JWT:** `Authorization: Bearer {token}`

#### 1. Récupérer toutes les Tâches

**Endpoint:** `GET /api/tasks`

**Paramètres optionnels:**
- `projectId`: Filtrer par projet
- `userId`: Filtrer par utilisateur assigné
- `status`: Filtrer par statut (TODO, IN_PROGRESS, DONE)

**Exemples:**
- `GET /api/tasks`
- `GET /api/tasks?projectId=1`
- `GET /api/tasks?userId=4`
- `GET /api/tasks?status=IN_PROGRESS`

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Créer la base de données",
      "description": "Mettre en place le schéma de la base",
      "projectId": 1,
      "assignedTo": 4,
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "dueDate": "2025-02-01"
    }
  ]
}
```

---

#### 2. Récupérer une Tâche par ID

**Endpoint:** `GET /api/tasks/{id}`

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Créer la base de données",
    "description": "Mettre en place le schéma de la base",
    "projectId": 1,
    "assignedTo": 4,
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "dueDate": "2025-02-01"
  }
}
```

---

#### 3. Créer une Tâche

**Endpoint:** `POST /api/tasks`

**Corps de la requête:**
```json
{
  "title": "Développer l'interface utilisateur",
  "description": "Créer les composants React",
  "projectId": 1,
  "assignedTo": 4,
  "status": "TODO",
  "priority": "MEDIUM",
  "dueDate": "2025-02-15"
}
```

**Réponse (201 Created):**
```json
{
  "success": true,
  "message": "Tâche créée avec succès",
  "data": {
    "id": 2,
    "title": "Développer l'interface utilisateur",
    "description": "Créer les composants React",
    "projectId": 1,
    "assignedTo": 4,
    "status": "TODO",
    "priority": "MEDIUM",
    "dueDate": "2025-02-15"
  }
}
```

---

#### 4. Modifier une Tâche

**Endpoint:** `PUT /api/tasks/{id}`

**Corps de la requête:**
```json
{
  "title": "Développer l'interface utilisateur - Mis à jour",
  "description": "Créer tous les composants React nécessaires",
  "status": "IN_PROGRESS",
  "priority": "HIGH"
}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Tâche mise à jour avec succès",
  "data": { /* données mises à jour */ }
}
```

---

#### 5. Mettre à jour le Statut d'une Tâche

**Endpoint:** `PATCH /api/tasks/{id}/status`

**Corps de la requête:**
```json
{
  "status": "DONE"
}
```

**Valeurs possibles:** TODO, IN_PROGRESS, DONE

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Statut mis à jour avec succès",
  "data": { /* données mises à jour */ }
}
```

---

#### 6. Supprimer une Tâche

**Endpoint:** `DELETE /api/tasks/{id}`

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Tâche supprimée avec succès",
  "data": null
}
```

---

### 📊 Dashboard

**Tous les endpoints nécessitent un token JWT:** `Authorization: Bearer {token}`

#### 1. Récupérer les Métriques du Dashboard

**Endpoint:** `GET /api/dashboard/metrics?userId={userId}`

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalInterns": 15,
    "activeProjects": 8,
    "completedTasks": 45,
    "pendingTasks": 23
  }
}
```

---

#### 2. Récupérer les Statistiques par Département

**Endpoint:** `GET /api/dashboard/departments`

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "department": "Informatique",
      "count": 10
    },
    {
      "department": "Ressources Humaines",
      "count": 5
    }
  ]
}
```

---

#### 3. Récupérer les Statistiques de Statut des Projets

**Endpoint:** `GET /api/dashboard/project-status`

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": {
    "planning": 3,
    "inProgress": 5,
    "completed": 2,
    "onHold": 1,
    "cancelled": 0
  }
}
```

---

#### 4. Récupérer les Statistiques des Tâches

**Endpoint:** `GET /api/dashboard/task-stats`

**Réponse (200 OK):**
```json
{
  "success": true,
  "data": {
    "todo": 15,
    "inProgress": 10,
    "done": 25
  }
}
```

---

## 🧪 Tests avec Postman

Une collection Postman complète est disponible dans `POSTMAN_COLLECTION.json`.

### Import de la Collection

1. Ouvrez Postman
2. Cliquez sur **Import**
3. Sélectionnez le fichier `POSTMAN_COLLECTION.json`
4. La collection sera importée avec tous les endpoints

### Variables d'Environnement

Créez un environnement Postman avec les variables suivantes :

```
base_url = http://localhost:8080/api
token = (sera rempli automatiquement après login)
```

### Flux de Test Recommandé

1. **Initialiser le système**
   - `POST /api/auth/init-admin`

2. **Se connecter en tant qu'Admin**
   - `POST /api/auth/login`
   - Le token sera automatiquement sauvegardé

3. **Créer un Encadreur**
   - `POST /api/auth/register/encadreur`

4. **Créer un Stagiaire**
   - `POST /api/auth/register/stagiaire`

5. **Le Stagiaire vérifie son email**
   - `POST /api/auth/check-email`

6. **Le Stagiaire crée son mot de passe**
   - `POST /api/auth/create-password`

7. **Créer un Projet**
   - `POST /api/projects`

8. **Créer des Tâches**
   - `POST /api/tasks`

9. **Assigner des Stagiaires au Projet**
   - `POST /api/projects/{id}/assign-interns`

10. **Consulter le Dashboard**
    - `GET /api/dashboard/metrics?userId=1`

---

## 🔒 Sécurité

- Authentification JWT avec expiration de 24 heures
- Mots de passe hashés avec BCrypt
- Protection CSRF désactivée (API REST)
- CORS configuré pour accepter toutes les origines (à modifier en production)
- Endpoints publics : `/api/auth/**`
- Endpoints protégés : nécessitent un token JWT valide

**Note:** Le mapping est `/api/auth/**` et non `/auth/**`. Assurez-vous d'utiliser le bon préfixe.

---

## 🚀 Déploiement

Pour créer un fichier JAR exécutable :

```bash
mvn clean package
java -jar target/management-system-1.0.0.jar
```

---

## 🌍 Variables d'Environnement en Production

Modifiez ces valeurs pour la production :

```properties
# JWT Secret (256 bits minimum)
jwt.secret=votre-clé-secrète-très-longue-et-sécurisée

# Base de données
spring.datasource.url=jdbc:mysql://votre-serveur:3306/internship_db
spring.datasource.username=votre_utilisateur
spring.datasource.password=votre_mot_de_passe

# CORS (limiter aux domaines autorisés)
# Modifier dans SecurityConfig.java
```

---

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.
