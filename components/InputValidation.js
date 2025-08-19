// Input validation and sanitization
export function validateInput(input, type = 'text') {
  if (type === 'text') return /^[\w\s\-\.]+$/.test(input);
  if (type === 'email') return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input);
  if (type === 'number') return !isNaN(Number(input));
  return false;
}
