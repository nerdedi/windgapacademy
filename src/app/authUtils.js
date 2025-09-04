// Simple validation utilities for authentication
function validateEmail(email) {
  if (!email || typeof email !== "string") return false;
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
}

function validatePassword(password) {
  if (!password || typeof password !== "string") return false;
  const p = password.trim();
  // At least 6 chars, contains a letter and a number
  return p.length >= 6 && /[A-Za-z]/.test(p) && /\d/.test(p);
}

module.exports = { validateEmail, validatePassword };
