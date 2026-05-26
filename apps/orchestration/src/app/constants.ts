/**
 * Application-wide constants for routes, localStorage keys, and configuration
 */

// Routes
export const ROUTES = {
  HOME: '/',
  PREVIEW: '/preview',
  AUTH_CALLBACK: '/auth/openid-connect/callback',
  NOT_AUTHORIZED: '/not-authorized',
  NOT_FOUND: '/not-found',
  NOT_IMPLEMENTED: '/not-implemented',
  SERVER_ERROR: '/server-error'
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  USER_ID: 'userId',
  TOKEN: 'token',
  USER_NAME: 'userName',
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  EMAIL: 'email',
  IS_ADMIN: 'isAdmin',
  ROLE: 'role',
  NEEDS_TO_RESET_PASSWORD: 'needsToResetPassword',
  USER_SESSION_EXPIRY: 'userSessionExpiry',
  OPENID_CONNECT_PROVIDER_ID: 'openIdConnectProviderId',
  SELECTED_BRANCH_ID: 'selectedBranchId'
};

// API Configuration
export const API_CONFIG = {
  MAURO_MODULE_NAME: 'mdm.pluginNhsDataDictionary',
  DEFAULT_BASE_URL: 'http://localhost:8080'
};

// Pattern Matchers
export const PATTERNS = {
  PREVIEW_BRANCH_PATH: /^\/preview\/([^/]+)/
};

// Error Messages
export const ERROR_MESSAGES = {
  SIGN_IN_FAILED: 'Invalid username or password!',
  STATISTICS_LOAD_FAILED: 'Could not load branch statistics.',
  INTEGRITY_CHECKS_LOAD_FAILED: 'Could not load integrity checks.',
  CHANGE_PAPER_LOAD_FAILED: 'Could not load the change paper preview. Please try again.',
  ABOUT_LOAD_FAILED: 'Could not load version information.',
  OPENID_MISSING_PARAMS: 'Missing OpenID Connect callback parameters. Please try signing in again.',
  OPENID_MISSING_ENDPOINT: 'Unable to authenticate with {provider} because of a missing endpoint.',
  PUBLISH_FAILED: 'Could not complete publish action for branch "{branch}".'
};

// Notification Titles
export const NOTIFICATION_TITLES = {
  CODE_SYSTEMS_GENERATED: 'CodeSystems generated',
  VALUE_SETS_GENERATED: 'ValueSets generated',
  CHANGE_PAPER_GENERATED: 'Change paper generated',
  WEBSITE_GENERATED: 'Website generated',
  GENERATION_FAILED: 'Generation failed'
};

// Notification Messages
export const NOTIFICATION_MESSAGES = {
  CODE_SYSTEMS_GENERATED: (branch: string) =>
    `CodeSystems generated successfully for branch "${branch}".`,
  VALUE_SETS_GENERATED: (branch: string) =>
    `ValueSets generated successfully for branch "${branch}".`,
  CHANGE_PAPER_GENERATED: (branch: string) =>
    `Change paper generated successfully for branch "${branch}".`,
  CHANGE_PAPER_WITH_DATASET_GENERATED: (branch: string) =>
    `Change paper (with Data Set definitions) generated successfully for branch "${branch}".`,
  WEBSITE_GENERATED: (branch: string) =>
    `Website generated successfully for branch "${branch}".`
};

