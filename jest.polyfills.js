// Early polyfills that must be available before any module loads
// Polyfill TextEncoder for Node.js
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}

// Provide a no-op alert to satisfy components that call window.alert
if (typeof window !== 'undefined' && typeof window.alert !== 'function') {
  window.alert = () => {};
}
