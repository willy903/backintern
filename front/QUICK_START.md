# Démarrage Rapide - Frontend + Backend

## Prérequis

- Node.js 18+
- Java 17+
- Maven 3.8+
- MySQL 8.0+

## Configuration

### 1. Base de données

```sql
CREATE DATABASE internship_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Spring Boot

```bash
cd spring-boot-backend

# Configurer MySQL dans src/main/resources/application.properties
# Modifier les identifiants si nécessaire:
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe

# Démarrer le backend
mvn spring-boot:run
```

Le backend sera disponible sur `http://localhost:8080`

### 3. Frontend React

```bash
# À la racine du projet
npm install

# Créer le fichier de configuration
echo "VITE_API_URL=http://localhost:8080/api" > .env.local

# Démarrer le frontend
npm run dev
```

Le frontend sera disponible sur `http://localhost:5173`

## Initialisation des Données

### Option 1: Via l'API

```bash
# Créer un admin par défaut
curl -X POST http://localhost:8080/api/auth/init-admin
```

Cela créera un utilisateur:
- Email: `admin@company.com`
- Status: `PENDING_PASSWORD` (doit définir un mot de passe à la première connexion)

### Option 2: Via SQL

Exécutez le script: `spring-boot-backend/database/schema.sql`

## Premier Login

### Avec la nouvelle page de login (recommandé)

1. Changez dans `src/App.tsx`:
```typescript
// Remplacer
import Login from './pages/Login';

// Par
import Login from './pages/LoginWithApi';
```

2. Ouvrez http://localhost:5173
3. Entrez l'email: `admin@company.com`
4. Créez votre mot de passe
5. Vous serez automatiquement connecté

### Avec l'ancienne page (données mockées)

Utilisez les comptes de démonstration:
- RH: `rh@company.com` / `password123`
- Encadreur: `encadreur@company.com` / `password123`
- Stagiaire: `stagiaire@company.com` / `password123`

## Structure des Services API

### Services Disponibles

```
src/services/
├── api.ts                    # Service HTTP de base
├── authService.ts            # Authentification
├── dashboardService.ts       # Dashboard
├── internService.ts          # Gestion des stagiaires
├── projectService.ts         # Gestion des projets
├── taskService.ts            # Gestion des tâches
└── encadreurService.ts       # Gestion des encadreurs
```

### Hook Utilitaire

```
src/hooks/
└── useApiError.ts            # Gestion des erreurs API
```

## Test de l'API

### Avec Postman

Importez: `spring-boot-backend/POSTMAN_COLLECTION.json`

### Avec cURL

```bash
# Check email
curl -X POST http://localhost:8080/api/auth/check-email \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"votre_mot_de_passe"}'

# Get dashboard (avec token)
curl http://localhost:8080/api/dashboard \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

## Scénarios Supportés

### 1. Connexion Standard
✅ Vérification d'email
✅ Login avec mot de passe
✅ Stockage du token JWT
✅ Persistance de session

### 2. Premier Login
✅ Détection d'utilisateur sans mot de passe
✅ Création de mot de passe
✅ Connexion automatique après création

### 3. Déconnexion
✅ Nettoyage du token
✅ Nettoyage des données utilisateur
✅ Redirection vers login

### 4. Gestion des Erreurs
✅ Token expiré → Déconnexion automatique
✅ Erreur réseau → Message d'erreur
✅ 401 Unauthorized → Redirection login
✅ 403 Forbidden → Message de permission
✅ 404 Not Found → Message d'erreur
✅ 500 Server Error → Message d'erreur

### 5. CRUD Stagiaires
✅ Lister tous les stagiaires
✅ Filtrer par encadreur
✅ Créer un stagiaire
✅ Modifier un stagiaire
✅ Supprimer un stagiaire

### 6. CRUD Projets
✅ Lister tous les projets
✅ Filtrer par stagiaire
✅ Filtrer par encadreur
✅ Créer un projet
✅ Modifier un projet
✅ Supprimer un projet

### 7. CRUD Tâches
✅ Lister toutes les tâches
✅ Filtrer par projet
✅ Filtrer par stagiaire
✅ Créer une tâche
✅ Modifier une tâche (statut, priorité)
✅ Supprimer une tâche

### 8. Dashboard
✅ Métriques globales
✅ Statistiques par département
✅ Statistiques de projets
✅ Statistiques de tâches

## Permissions par Rôle

### ROLE_ADMIN (Responsable RH)
- ✅ Voir tous les stagiaires, projets, tâches
- ✅ Créer des encadreurs
- ✅ Créer/modifier/supprimer des stagiaires
- ✅ Créer/modifier/supprimer des projets
- ✅ Créer/modifier/supprimer des tâches

### ROLE_ENCADREUR
- ✅ Voir ses stagiaires et leurs projets/tâches
- ✅ Créer des stagiaires (qui lui seront assignés)
- ✅ Créer/modifier des projets pour ses stagiaires
- ✅ Créer/modifier des tâches pour ses stagiaires
- ❌ Ne peut pas voir les autres encadreurs

### ROLE_STAGIAIRE
- ✅ Voir ses projets et tâches
- ✅ Modifier le statut de ses tâches
- ❌ Ne peut pas créer de projets
- ❌ Ne peut pas voir les autres stagiaires

## Déconnexion

### Via l'Interface

Cliquez sur votre profil (en haut à droite) → "Se déconnecter"

### Via le Code

```typescript
import { useAuth } from './contexts/AuthContext';

const { signOut } = useAuth();

// Déconnexion
await signOut();
```

La déconnexion:
1. Supprime le token JWT du localStorage
2. Supprime les données utilisateur du localStorage
3. Réinitialise le state de l'AuthContext
4. Redirige vers la page de login

## Prochaines Étapes

1. **Remplacer les données mockées**
   - Consulter `IMPLEMENTATION_EXAMPLES.md`
   - Remplacer progressivement par les appels API

2. **Tester tous les scénarios**
   - Créer des comptes
   - Tester les permissions
   - Vérifier la déconnexion

3. **Personnaliser**
   - Adapter les messages d'erreur
   - Ajouter des validations
   - Améliorer l'UX

## Documentation

- `API_INTEGRATION_GUIDE.md` - Guide complet d'intégration
- `IMPLEMENTATION_EXAMPLES.md` - Exemples de code
- `spring-boot-backend/README.md` - Documentation du backend
- `spring-boot-backend/POSTMAN_COLLECTION.json` - Collection Postman

## Support

En cas de problème:
1. Vérifiez que le backend est démarré
2. Vérifiez que MySQL fonctionne
3. Vérifiez les logs du backend
4. Vérifiez la console du navigateur
5. Consultez les guides de documentation
