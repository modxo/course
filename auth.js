// auth.js
// Authentication utilities

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password) {
  return password && password.length >= 6;
}

/**
 * Hash password (client-side, for demo - use proper hashing on backend in production)
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Get stored auth token
 */
export function getAuthToken() {
  return localStorage.getItem('auth_token');
}

/**
 * Set stored auth token
 */
export function setAuthToken(token) {
  localStorage.setItem('auth_token', JSON.stringify(token));
}

/**
 * Clear auth token
 */
export function clearAuthToken() {
  localStorage.removeItem('auth_token');
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser() {
  const token = localStorage.getItem('auth_token');
  return token ? JSON.parse(token) : null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return getCurrentUser() !== null;
}

/**
 * Set current user
 */
export function setCurrentUser(user) {
  setAuthToken(user);
}

/**
 * Logout user
 */
export function logout() {
  clearAuthToken();
  window.location.href = '/index.html';
}
