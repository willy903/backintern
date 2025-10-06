export type UserRole = 'ROLE_STAGIAIRE' | 'ROLE_ENCADREUR' | 'ROLE_ADMIN' | 'stagiaire' | 'encadreur' | 'responsable_rh';

export interface UserProfile {
  id?: string;
  email: string;
  nom?: string;
  prenom?: string;
  firstName: string;
  lastName: string;
  departement?: string;
  phone?: string;
  avatar_url?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  created_by: string | null;
  created_at: string;
}

export interface AuthUser {
  profile: UserProfile;
  role: UserRole | string;
}
