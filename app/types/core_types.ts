export interface OurganizeContactInterface {
    name: string;
    domain: string;
    url: string;
    phone: string;
    phone_clean: string;
    whatsapp_phone: string;
    email: string;
    address: string;
    slogan: string;
    social_media_links: {
        name: string;
        url: string;
        icon: string;
    }[];
};

export interface User {
  id: string
  name: string
  avatar: string
  email: string
  email_verified_at?: string
  profession_id?: string | null
  profession?: {
    id: string
    name: string
    slug: string
  } | null
  phone: string
  country: string
  city: string
  created_at: string
  updated_at: string
}

export interface AuthPayload {
  access_token: string
  token_type: string
  expires_in: number
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface Contact {
  id: number
  name: string
  email: string
  phone: string
  avatar: string
  company: string
  position: string
  status: 'online' | 'offline' | 'away'
  lastSeen: string
  unreadMessages: number
  tags: string[]
}

export interface Profession {
  id: string
  name: string
  slug: string
  sort_order: number
  is_active: boolean
}

export interface UserEducation {
  id: string;
  user_id: string;
  institution: string;
  degree?: string | null;
  field_of_study?: string | null;
  city?: string | null;
  country?: string | null;
  start_month?: number | null;
  start_year?: number | null;
  end_month?: number | null;
  end_year?: number | null;
  grade?: string | null;
  is_current: boolean;
  description?: string | null;
  start_date_formatted?: string | null;
  end_date_formatted?: string | null;
  education_period?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserEducationInput {
  institution: string;
  degree?: string | null;
  field_of_study?: string | null;
  city?: string | null;
  country?: string | null;
  start_month?: number | null;
  start_year?: number | null;
  end_month?: number | null;
  end_year?: number | null;
  grade?: string | null;
  is_current?: boolean | null;
  description?: string | null;
}

export interface UserExperience {
  id: string;
  user_id: string;
  company: string;
  title: string;
  city?: string | null;
  country?: string | null;
  start_month?: number | null;
  start_year?: number | null;
  end_month?: number | null;
  end_year?: number | null;
  description?: string | null;
  is_current: boolean;
  start_date_formatted?: string | null;
  end_date_formatted?: string | null;
  experience_period?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserExperienceInput {
  company: string;
  title: string;
  city?: string | null;
  country?: string | null;
  start_month?: number | null;
  start_year?: number | null;
  end_month?: number | null;
  end_year?: number | null;
  description?: string | null;
  is_current?: boolean | null;
}

export interface UserSkill {
  id: string;
  user_id: string;
  name: string;
  level: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface SelectMenuItem {
  label: string;
  value: string;
  icon?: string;
}

export interface UserSkillInput {
  name: string;
  level: string;
  is_primary?: boolean | null;
}

export interface UserSocialAccount {
  id: string;
  user_id: string;
  provider: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface UserSocialAccountInput {
  provider: string;
  username: string;
}

export interface UserModule {
  id: string;
  user_id: string;
  module_id: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserModuleInput {
  module_id: string;
  is_enabled?: boolean | null;
}

// ==========================================
// PMS (Project Management System) Types
// ==========================================

export interface Organization {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
  workspaces?: Workspace[];
}

export interface OrganizationInput {
  name: string;
  slug?: string;
}

export interface Workspace {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
  organization?: Organization;
  projects?: Project[];
}

export interface WorkspaceInput {
  organization_id: string;
  name: string;
  description?: string | null;
}

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  sort: number;
  is_featured: boolean;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  start_date: string | null;
  end_date: string | null;
  created_at?: string;
  updated_at?: string;
  workspace?: Workspace;
  project_detail?: ProjectDetail;
}

export interface ProjectInput {
  workspace_id: string;
  name: string;
  description?: string | null;
  sort?: number;
  is_featured?: boolean;
  status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  start_date?: string | null;
  end_date?: string | null;
}

export interface ProjectDetail {
  id: string;
  project_id: string;
  website: string | null;
  allocated_budget: number | null;
  technologies: string | null;
  created_at?: string;
  updated_at?: string;
  project?: Project;
}

export interface ProjectDetailInput {
  project_id: string;
  website?: string | null;
  allocated_budget?: number | null;
  technologies?: string | null;
}