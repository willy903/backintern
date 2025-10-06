# Guide de Tests - Système de Gestion de Stages

## 🔧 Configuration Initiale

### 1. Recréer la base de données

```bash
mysql -u root -p < database/schema_v2_clean.sql
```

Cette commande va :
- Supprimer l'ancienne base de données (si elle existe)
- Créer une nouvelle base de données propre
- Créer toutes les tables avec les bonnes contraintes
- Insérer des données de test
- Créer des vues utiles pour les requêtes complexes

### 2. Vérifier la connexion

Assurez-vous que votre fichier `.env` ou `application.properties` contient :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/internship_db
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe
```

### 3. Lancer l'application

```bash
./mvnw spring-boot:run
```

## 📊 Données de Test Disponibles

### Comptes par défaut

| Rôle | Email | Password | ID User | ID Encadreur |
|------|-------|----------|---------|--------------|
| Admin | admin@example.com | admin123 | 1 | - |
| Encadreur | jean.dupont@example.com | admin123 | 2 | 1 |
| Encadreur | marie.martin@example.com | admin123 | 3 | 2 |
| Stagiaire | stagiaire@example.com | (à créer) | 4 | - |

### Projets et Tâches

- 1 projet : "Plateforme E-Commerce" (ID: 1, Encadreur ID: 1)
- 3 tâches assignées au stagiaire (ID: 4)

## 🧪 Scénarios de Test

### Scénario 1 : Workflow complet Admin

1. **Login Admin**
   - Endpoint : `POST /api/auth/login`
   - Body : `{"email": "admin@example.com", "password": "admin123"}`
   - ✅ Copier le token reçu

2. **Créer un nouvel encadreur**
   - Endpoint : `POST /api/auth/encadreur`
   - Headers : `Authorization: Bearer {token}`
   - Body :
   ```json
   {
     "email": "nouvel.encadreur@example.com",
     "firstName": "Fatima",
     "lastName": "Zahra",
     "password": "password123",
     "phone": "+212611111111",
     "department": "Informatique",
     "specialization": "Data Science"
   }
   ```

3. **Créer un nouveau stagiaire**
   - Endpoint : `POST /api/interns`
   - Headers : `Authorization: Bearer {token}`
   - Body :
   ```json
   {
     "email": "nouveau.stagiaire@example.com",
     "firstName": "Pierre",
     "lastName": "Dubois",
     "phone": "+212612345678",
     "school": "Université Mohammed V",
     "department": "Informatique",
     "startDate": "2025-01-15",
     "endDate": "2025-06-15",
     "encadreurId": 1
   }
   ```
   - ✅ **Ce test devrait maintenant fonctionner correctement**

4. **Voir le dashboard**
   - Endpoint : `GET /api/dashboard/metrics`
   - Headers : `Authorization: Bearer {token}`

### Scénario 2 : Workflow Encadreur

1. **Login Encadreur**
   - Endpoint : `POST /api/auth/login`
   - Body : `{"email": "jean.dupont@example.com", "password": "admin123"}`
   - ✅ Copier le token

2. **Voir mes stagiaires**
   - Endpoint : `GET /api/interns/my-interns`
   - Headers : `Authorization: Bearer {token}`

3. **Créer un projet**
   - Endpoint : `POST /api/projects`
   - Headers : `Authorization: Bearer {token}`
   - Body :
   ```json
   {
     "title": "Application Mobile de Gestion",
     "description": "Développement d'une application mobile",
     "encadreurId": 1,
     "department": "Informatique",
     "startDate": "2025-02-01",
     "endDate": "2025-07-31",
     "status": "PLANNING"
   }
   ```

4. **Assigner un stagiaire au projet**
   - Endpoint : `POST /api/projects/{projectId}/assign/{internId}`
   - Headers : `Authorization: Bearer {token}`

5. **Créer des tâches**
   - Endpoint : `POST /api/tasks`
   - Headers : `Authorization: Bearer {token}`
   - Body :
   ```json
   {
     "title": "Créer la base de données",
     "description": "Concevoir et implémenter le schéma",
     "projectId": 1,
     "assignedTo": 4,
     "status": "TODO",
     "priority": "HIGH",
     "dueDate": "2025-02-15"
   }
   ```

6. **Voir mon dashboard**
   - Endpoint : `GET /api/dashboard/my-dashboard`
   - Headers : `Authorization: Bearer {token}`

### Scénario 3 : Workflow Stagiaire

1. **Créer son mot de passe** (première connexion)
   - Endpoint : `POST /api/auth/create-password`
   - Body :
   ```json
   {
     "email": "stagiaire@example.com",
     "password": "stagiaire123"
   }
   ```

2. **Login**
   - Endpoint : `POST /api/auth/login`
   - Body : `{"email": "stagiaire@example.com", "password": "stagiaire123"}`
   - ✅ Copier le token

3. **Voir mes tâches**
   - Endpoint : `GET /api/tasks/my-tasks`
   - Headers : `Authorization: Bearer {token}`

4. **Mettre à jour une tâche**
   - Endpoint : `PUT /api/tasks/{taskId}`
   - Headers : `Authorization: Bearer {token}`
   - Body : Modifier le status à "IN_PROGRESS" ou "DONE"

## 🔍 Tests de Validation

### Test 1 : Création de stagiaire avec encadreur

**Avant le fix :**
```
❌ Erreur: "Cannot invoke getUser().getNom() because return value is null"
```

**Après le fix :**
```json
✅ {
  "success": true,
  "data": {
    "id": 5,
    "email": "nouveau.stagiaire@example.com",
    "firstName": "Pierre",
    "lastName": "Dubois",
    "encadreurNom": "Dupont",
    "encadreurPrenom": "Jean",
    "status": "PENDING"
  }
}
```

### Test 2 : Vérifier les relations en base

```sql
-- Vérifier qu'un stagiaire est bien lié à un encadreur
SELECT
    i.id as intern_id,
    u.email as intern_email,
    CONCAT(u.prenom, ' ', u.nom) as intern_name,
    e.id as encadreur_id,
    CONCAT(eu.prenom, ' ', eu.nom) as encadreur_name
FROM interns i
JOIN users u ON i.user_id = u.id
JOIN encadreurs e ON i.encadreur_id = e.id
JOIN users eu ON e.user_id = eu.id;
```

### Test 3 : Vue complète des stagiaires

```sql
-- Utiliser la vue créée automatiquement
SELECT * FROM v_interns_complete;
```

## 📝 Import Postman

1. Ouvrir Postman
2. Cliquer sur "Import"
3. Sélectionner le fichier `POSTMAN_COLLECTION_V2.json`
4. La collection s'affiche avec 8 dossiers organisés

### Variables de collection automatiques

Les variables suivantes sont automatiquement mises à jour :
- `admin_token` : Token admin après login
- `encadreur_token` : Token encadreur après login
- `stagiaire_token` : Token stagiaire après login
- `intern_id` : ID du dernier stagiaire créé
- `project_id` : ID du dernier projet créé
- `task_id` : ID de la dernière tâche créée

## 🎯 Ordre de Test Recommandé

1. **Authentication** → Login Admin
2. **Authentication** → Créer Encadreur
3. **Authentication** → Login Encadreur
4. **Interns Management** → Créer Stagiaire avec encadreur
5. **Projects Management** → Créer Projet
6. **Projects Management** → Assigner Stagiaire au Projet
7. **Tasks Management** → Créer Tâches
8. **Dashboard** → Voir métriques

## 🔧 Corrections Apportées

### Problème Principal
Le bug était dans `InternService.java` ligne 44-46 :
```java
// ❌ AVANT (incorrect)
Encadreur encadreur = Encadreur.builder()
        .id(request.getEncadreurId())
        .build();
```

Cette approche créait un objet `Encadreur` vide avec juste l'ID, sans charger l'entité complète avec son `User` associé.

```java
// ✅ APRÈS (correct)
Encadreur encadreur = encadreurRepository.findById(request.getEncadreurId())
        .orElseThrow(() -> new RuntimeException("ENCADREUR_NOT_FOUND"));
```

Maintenant, l'encadreur complet est chargé depuis la base de données avec toutes ses relations.

### Améliorations Base de Données

1. **Nomenclature claire** : Noms de contraintes explicites
2. **Index optimisés** : Sur les colonnes fréquemment utilisées
3. **Contraintes CHECK** : Validation des données (ex: progress entre 0 et 100)
4. **Vues utiles** : Pour simplifier les requêtes complexes
5. **Données cohérentes** : Tests pré-configurés qui fonctionnent

## ❓ Troubleshooting

### Erreur : "Table already exists"
```bash
# Supprimer et recréer la base
mysql -u root -p -e "DROP DATABASE IF EXISTS internship_db;"
mysql -u root -p < database/schema_v2_clean.sql
```

### Erreur : "Foreign key constraint fails"
- Vérifier que l'`encadreurId` existe dans la table `encadreurs`
- Consulter : `SELECT id FROM encadreurs;`

### Erreur : "Access denied"
- Vérifier les credentials dans `application.properties`
- Vérifier les permissions MySQL : `GRANT ALL ON internship_db.* TO 'root'@'localhost';`

## 📈 Statistiques Disponibles

La base de données inclut des requêtes statistiques :
```sql
-- Voir les statistiques générales
SELECT * FROM (
  SELECT 'Utilisateurs' AS entite, COUNT(*) AS total FROM users
  UNION ALL
  SELECT 'Stagiaires', COUNT(*) FROM interns
  UNION ALL
  SELECT 'Projets', COUNT(*) FROM projects
  UNION ALL
  SELECT 'Tâches', COUNT(*) FROM tasks
) stats;
```
