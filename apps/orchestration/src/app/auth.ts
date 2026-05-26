import { SignInResult } from 'api-client';

const USER_SESSION_EXPIRY_DAYS = 1;

export function persistUserSession(user: SignInResult): void {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + USER_SESSION_EXPIRY_DAYS);

  localStorage.setItem('userId', user.id);
  localStorage.setItem('token', user.token ?? '');
  localStorage.setItem('userName', user.emailAddress);
  localStorage.setItem('firstName', user.firstName);
  localStorage.setItem('lastName', user.lastName);
  localStorage.setItem('email', user.emailAddress);
  localStorage.setItem('isAdmin', 'false');
  localStorage.setItem('role', user.userRole?.toLowerCase() ?? '');
  localStorage.setItem('needsToResetPassword', (user.needsToResetPassword ?? false).toString());
  localStorage.setItem('userSessionExpiry', expiryDate.toISOString());
}

export function clearUserSession(): void {
  localStorage.removeItem('userId');
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  localStorage.removeItem('firstName');
  localStorage.removeItem('lastName');
  localStorage.removeItem('email');
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('role');
  localStorage.removeItem('needsToResetPassword');
  localStorage.removeItem('userSessionExpiry');
  localStorage.removeItem('openIdConnectProviderId');
}

export function getOpenIdConnectRedirectUri(): string {
  return new URL(`${import.meta.env.BASE_URL}redirects/open-id-connect-redirect.html`, window.location.origin).toString();
}

