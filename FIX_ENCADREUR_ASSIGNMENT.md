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
