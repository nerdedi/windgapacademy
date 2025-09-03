import { useEffect, useState } from 'react';

/**
 * useSecureToken
 * - key: storage key
 * Returns [token, setToken, clearToken]
 * - Note: for production you may want to encrypt tokens before storing.
 */
export default function useSecureToken(key = 'wg_token') {
  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem(key) || null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (token) sessionStorage.setItem(key, token);
      else sessionStorage.removeItem(key);
    } catch (e) {
      // ignore storage errors
    }
  }, [key, token]);

  const clearToken = () => setToken(null);

  return [token, setToken, clearToken];
}

