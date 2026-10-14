import type { AppPreferences, UserProfile } from '@vue-mf/types';

const PROFILE_KEY = 'mf-auth-user';
const PREFERENCES_KEY = 'mf-settings-preferences';

const defaultProfile: UserProfile = { name: 'Convidado', email: '', role: 'viewer' };
const defaultPreferences: AppPreferences = {
  theme: 'dark',
  language: 'pt-BR',
  notificationsEnabled: true,
};

export function readProfile(): UserProfile {
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? (JSON.parse(raw) as UserProfile) : defaultProfile;
}

export function writeProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function readPreferences(): AppPreferences {
  const raw = localStorage.getItem(PREFERENCES_KEY);
  return raw ? { ...defaultPreferences, ...JSON.parse(raw) } : defaultPreferences;
}

export function writePreferences(preferences: AppPreferences): void {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
}
