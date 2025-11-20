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
  job_type_id?: string | null
  job_type?: {
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