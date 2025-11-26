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

export interface UserEducationsData {
  userEducations: UserEducation[];
}

export interface UserEducationData {
  userEducation: UserEducation | null;
}