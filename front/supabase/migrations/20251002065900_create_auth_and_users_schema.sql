/*
  # Création du schéma d'authentification et gestion des utilisateurs

  ## Description
  Mise en place d'un système d'authentification multi-rôles pour la gestion de stagiaires
  avec trois types d'utilisateurs : Stagiaire, Encadreur, et Responsable RH.

  ## 1. Nouvelles Tables

  ### `user_roles`
  - `id` (uuid, clé primaire)
  - `user_id` (uuid, référence vers auth.users)
  - `role` (text) - Types: 'stagiaire', 'encadreur', 'responsable_rh'
  - `created_by` (uuid, référence vers auth.users) - Qui a créé ce compte
  - `created_at` (timestamptz)
  
  ### `profiles`
  - `id` (uuid, clé primaire, référence vers auth.users)
  - `email` (text)
  - `nom` (text)
  - `prenom` (text)
  - `departement` (text)
  - `phone` (text)
  - `avatar_url` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `encadreur_stagiaire`
  - `id` (uuid, clé primaire)
  - `encadreur_id` (uuid, référence vers auth.users)
  - `stagiaire_id` (uuid, référence vers auth.users)
  - `assigned_at` (timestamptz)

  ## 2. Sécurité (RLS)
  - Activation de RLS sur toutes les tables
  - Politiques pour permettre aux utilisateurs de voir leurs propres données
  - Politiques pour les encadreurs de voir leurs stagiaires
  - Politiques pour les RH de voir tous les utilisateurs

  ## 3. Notes importantes
  - Les mots de passe sont gérés par Supabase Auth
  - Chaque utilisateur a un profil dans la table profiles
  - Les relations encadreur-stagiaire sont gérées dans encadreur_stagiaire
  - Un stagiaire peut avoir un seul encadreur
  - Un encadreur peut avoir plusieurs stagiaires
*/

-- Table user_roles pour gérer les rôles
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('stagiaire', 'encadreur', 'responsable_rh')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Table profiles pour les informations utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  nom text NOT NULL,
  prenom text NOT NULL,
  departement text DEFAULT '',
  phone text DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table de liaison encadreur-stagiaire
CREATE TABLE IF NOT EXISTS encadreur_stagiaire (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  encadreur_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stagiaire_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(stagiaire_id)
);

-- Activer RLS sur toutes les tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE encadreur_stagiaire ENABLE ROW LEVEL SECURITY;

-- Politiques pour user_roles
CREATE POLICY "Users can view own role"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "RH can view all roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'responsable_rh'
    )
  );

CREATE POLICY "Encadreurs can view stagiaires roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'encadreur'
    )
    AND
    EXISTS (
      SELECT 1 FROM encadreur_stagiaire
      WHERE encadreur_id = auth.uid() AND stagiaire_id = user_roles.user_id
    )
  );

CREATE POLICY "Encadreurs can create stagiaire roles"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'encadreur'
    )
    AND role = 'stagiaire'
    AND created_by = auth.uid()
  );

CREATE POLICY "RH can create encadreur roles"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'responsable_rh'
    )
    AND role = 'encadreur'
    AND created_by = auth.uid()
  );

-- Politiques pour profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "RH can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'responsable_rh'
    )
  );

CREATE POLICY "Encadreurs can view stagiaires profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'encadreur'
    )
    AND
    EXISTS (
      SELECT 1 FROM encadreur_stagiaire
      WHERE encadreur_id = auth.uid() AND stagiaire_id = profiles.id
    )
  );

CREATE POLICY "Encadreurs can insert stagiaire profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'encadreur'
    )
  );

CREATE POLICY "RH can insert encadreur profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'responsable_rh'
    )
  );

-- Politiques pour encadreur_stagiaire
CREATE POLICY "Encadreurs can view their stagiaires"
  ON encadreur_stagiaire FOR SELECT
  TO authenticated
  USING (auth.uid() = encadreur_id);

CREATE POLICY "RH can view all encadreur-stagiaire relations"
  ON encadreur_stagiaire FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'responsable_rh'
    )
  );

CREATE POLICY "Stagiaires can view their encadreur"
  ON encadreur_stagiaire FOR SELECT
  TO authenticated
  USING (auth.uid() = stagiaire_id);

CREATE POLICY "Encadreurs can assign stagiaires to themselves"
  ON encadreur_stagiaire FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = encadreur_id
    AND
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'encadreur'
    )
  );

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();
