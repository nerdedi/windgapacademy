import React, { useState } from "react";

import { useAuth } from "./AuthProvider";

export default function Login() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
