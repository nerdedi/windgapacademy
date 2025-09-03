import { useState } from "react";

export default function useSecureToken() {
  const [token, setToken] = useState(null);
  // Example: fetch/store token securely
  return [token, setToken];
}
