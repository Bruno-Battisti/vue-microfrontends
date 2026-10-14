export interface UserProfile {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
}

export interface AppPreferences {
  theme: 'light' | 'dark';
  language: 'pt-BR' | 'en-US';
  notificationsEnabled: boolean;
}
