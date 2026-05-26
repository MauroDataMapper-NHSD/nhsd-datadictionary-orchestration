import { SignInResult } from 'api-client';
import { STORAGE_KEYS } from './constants';

const USER_SESSION_EXPIRY_DAYS = 1;

export function persistUserSession(user: SignInResult): void {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + USER_SESSION_EXPIRY_DAYS);

  localStorage.setItem(STORAGE_KEYS.USER_ID, user.id);
  localStorage.setItem(STORAGE_KEYS.TOKEN, user.token ?? '');
  localStorage.setItem(STORAGE_KEYS.USER_NAME, user.emailAddress);
  localStorage.setItem(STORAGE_KEYS.FIRST_NAME, user.firstName);
  localStorage.setItem(STORAGE_KEYS.LAST_NAME, user.lastName);
  localStorage.setItem(STORAGE_KEYS.EMAIL, user.emailAddress);
  localStorage.setItem(STORAGE_KEYS.IS_ADMIN, 'false');
  localStorage.setItem(STORAGE_KEYS.ROLE, user.userRole?.toLowerCase() ?? '');
  localStorage.setItem(STORAGE_KEYS.NEEDS_TO_RESET_PASSWORD, (user.needsToResetPassword ?? false).toString());
  localStorage.setItem(STORAGE_KEYS.USER_SESSION_EXPIRY, expiryDate.toISOString());
}

export function clearUserSession(): void {
  localStorage.removeItem(STORAGE_KEYS.USER_ID);
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_NAME);
  localStorage.removeItem(STORAGE_KEYS.FIRST_NAME);
  localStorage.removeItem(STORAGE_KEYS.LAST_NAME);
  localStorage.removeItem(STORAGE_KEYS.EMAIL);
  localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
  localStorage.removeItem(STORAGE_KEYS.ROLE);
  localStorage.removeItem(STORAGE_KEYS.NEEDS_TO_RESET_PASSWORD);
  localStorage.removeItem(STORAGE_KEYS.USER_SESSION_EXPIRY);
  localStorage.removeItem(STORAGE_KEYS.OPENID_CONNECT_PROVIDER_ID);
}

export function getOpenIdConnectRedirectUri(): string {
  return new URL(`${import.meta.env.BASE_URL}redirects/open-id-connect-redirect.html`, window.location.origin).toString();
}


