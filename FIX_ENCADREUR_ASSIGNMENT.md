# Correction du problème d'assignation d'encadreur

## Problème identifié

Lorsque vous créez un stagiaire et assignez un encadreur, cela fonctionne pour les premiers encadreurs (ID 2, 3) mais pas pour les autres (ID 6 ou plus).

### Cause racine

Le problème venait d'une confusion entre deux types d'IDs :

1. **User ID** : L'ID dans la table `users` (exemple: 2, 3, 6)
2. **Encadreur ID** : L'ID dans la table `encadreurs` (exemple: 1, 2, 3)

L'endpoint `GET /api/encadreurs` retournait le `User ID` dans le champ `id` du DTO, mais le service `InternService.createIntern()` cherchait dans la table `encadreurs` avec cet ID.

**Exemple du problème :**
- Encadreur avec `user_id = 6` pourrait avoir `encadreur_id = 3`
- Le frontend récupère les encadreurs et voit `id: 6` (User ID)
- Quand vous essayez d'assigner avec `encadreurId: 6`, le code cherche dans la table `encadreurs` avec `id = 6`
- Mais dans la table `encadreurs`, il n'y a que les IDs 1, 2, 3 → **ENCADREUR_NOT_FOUND**

## Solution implémentée

### 1. Ajout du champ `encadreurId` dans UserDTO

Ajout d'un champ séparé pour distinguer les deux types d'IDs :

```java
public class UserDTO {
    private Long id;           // User ID (table users)
    private Long encadreurId;  // Encadreur ID (table encadreurs)
    // ... autres champs
}
```

### 2. Mise à jour du EncadreurService

Les méthodes `convertToDTO` et `convertToDTOWithEncadreurId` ont été corrigées pour inclure les deux IDs :

```java
return UserDTO.builder()
    .id(user.getId())              // User ID
    .encadreurId(encadreurId)      // Encadreur ID
    // ... autres champs
    .build();
```

## Utilisation correcte

### Frontend

Lorsque vous récupérez la liste des encadreurs :

```javascript
// GET /api/encadreurs
const response = await fetch('/api/encadreurs');
const encadreurs = await response.json();

// Maintenant chaque encadreur a deux IDs :
// - id : User ID (pour affichage, recherche utilisateur)
// - encadreurId : Encadreur ID (pour assignation aux stagiaires)
```

### Création d'un stagiaire avec assignation

Utilisez le champ `encadreurId` (pas `id`) pour l'assignation :

```javascript
const createInternRequest = {
  email: "stagiaire@example.com",
  firstName: "Jean",
  lastName: "Dupont",
  encadreurId: encadreur.encadreurId,  // ✅ Utilisez encadreurId
  // ... autres champs
};

// POST /api/interns
await fetch('/api/interns', {
  method: 'POST',
  body: JSON.stringify(createInternRequest)
});
```

## Vérification

Pour vérifier que tout fonctionne :

1. Récupérez la liste des encadreurs : `GET /api/encadreurs`
2. Notez le champ `encadreurId` de chaque encadreur
3. Créez un stagiaire en utilisant cet `encadreurId`
4. L'assignation devrait maintenant fonctionner pour tous les encadreurs

## Tables concernées

### Table `users`
- Contient tous les utilisateurs (ADMIN, ENCADREUR, STAGIAIRE)
- Colonne `id` : User ID

### Table `encadreurs`
- Contient uniquement les données spécifiques aux encadreurs
- Colonne `id` : Encadreur ID
- Colonne `user_id` : Référence vers `users.id`

---

# Configuration Frontend pour l'Assignation d'Encadreur

## Modifications Effectuées dans le Frontend

Le formulaire d'ajout de stagiaire a été ajusté pour envoyer les bonnes données au backend via l'endpoint `/api/interns`.

### 1. Changement d'Endpoint

**Avant**: Utilisait `authService.createStagiaire()` qui appelait `/auth/register/stagiaire`

**Après**: Utilise `internService.createIntern()` qui appelle `/api/interns`

### 2. Format de Payload Corrigé

Le formulaire envoie maintenant le format exact attendu par le backend:

```json
{
  "email": "stagiaire@example.com",
  "firstName": "Pierre",
  "lastName": "Dubois",
  "phone": "+212612345678",
  "school": "Université Mohammed V",
  "department": "Informatique",
  "startDate": "2025-01-15",
  "endDate": "2025-06-15",
  "encadreurId": 3
}
```

### 3. Mapping des Champs

Le formulaire fait maintenant le mapping correct:

| Champ Formulaire | Champ API | Type |
|-----------------|-----------|------|
| `prenom` | `firstName` | string |
| `nom` | `lastName` | string |
| `email` | `email` | string |
| `phone` | `phone` | string |
| `departement` | `department` | string |
| `school` | `school` | string |
| `startDate` | `startDate` | string (date) |
| `endDate` | `endDate` | string (date) |
| `encadreurId` | `encadreurId` | number |

### 4. Suppression du Champ "Filière"

Le champ `major` (Filière) a été supprimé car il n'est pas utilisé par le backend.

### 5. Type EncadreurDTO Mis à Jour

Ajout du champ `encadreurId` dans le type `EncadreurDTO`:

```typescript
export interface EncadreurDTO {
  id: number;
  encadreurId: number;  // Ajouté
  email: string;
  nom: string;
  prenom: string;
  phone: string;
  department: string;
  role: string;
  accountStatus: string;
  avatar: string | null;
  internCount?: number;  // Ajouté
}
```

### 6. Correction de la Lecture de l'ID Encadreur

**Avant**:
```typescript
const currentEncadreur = data.find(e => e.encadreurid === userData.id);
setFormData(prev => ({ ...prev, encadreurId: currentEncadreur.id }));
```

**Après**:
```typescript
const currentEncadreur = data.find(e => e.encadreurId === userData.id);
setFormData(prev => ({ ...prev, encadreurId: currentEncadreur.encadreurId }));
```

### 7. Logs de Debug

Des logs ont été ajoutés pour faciliter le débogage:

```typescript
console.log('=== ENCADREURS CHARGÉS ===');
console.log('Nombre d\'encadreurs:', data.length);
data.forEach(enc => {
  console.log(`Encadreur: ${enc.prenom} ${enc.nom} - ID: ${enc.id} - encadreurId: ${enc.encadreurId}`);
});

console.log('=== CRÉATION STAGIAIRE ===');
console.log('Données envoyées:', requestData);
console.log('encadreurId type:', typeof requestData.encadreurId);
console.log('encadreurId value:', requestData.encadreurId);
```

## Fichiers Frontend Modifiés

1. **`front/src/components/Modals/InternFormModal.tsx`**
   - Changement d'import: `authService` → `internService`
   - Changement d'appel: `createStagiaire()` → `createIntern()`
   - Mapping correct des champs vers le format API
   - Suppression du champ `major`
   - Ajout de logs de debug
   - Correction de la casse `encadreurId`

2. **`front/src/services/encadreurService.ts`**
   - Ajout du champ `encadreurId` dans `EncadreurDTO`
   - Ajout du champ optionnel `internCount`

## Test Complet de la Fonctionnalité

Pour tester que l'assignation fonctionne:

1. Ouvrir la console du navigateur (F12)
2. Cliquer sur "Ajouter un Stagiaire"
3. Remplir le formulaire et sélectionner un encadreur
4. Observer les logs dans la console:
   - Liste des encadreurs chargés avec leurs IDs
   - Données envoyées au backend
   - Type et valeur de l'`encadreurId`
5. Soumettre le formulaire
6. Vérifier que le stagiaire est bien créé et assigné à l'encadreur

## Endpoint Backend Utilisé

**POST** `http://localhost:8080/api/interns`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Body**:
```json
{
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "school": "string",
  "department": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "encadreurId": number
}
```

## Notes Importantes

- L'`encadreurId` doit correspondre à l'ID de la table `encadreurs` (pas l'ID user)
- Le champ est obligatoire et doit être un nombre (pas une chaîne)
- Le backend valide que l'encadreur existe avant de créer le stagiaire
- Avec les corrections du cache Hibernate, tous les encadreurs devraient maintenant fonctionner
