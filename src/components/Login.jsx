import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with real authentication
    login(role, name);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form p-4">
      <h2 className="text-xl font-bold mb-2">Login</h2>
      <div className="mb-2">
        <label>Role:</label>
        <select value={role} onChange={e => setRole(e.target.value)} className="ml-2">
          <option value="admin">Admin</option>
          <option value="student">Student</option>
        </select>
      </div>
      <div className="mb-2">
        <label>Name:</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} className="ml-2 px-2 py-1 border rounded" required />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
    </form>
  );
};

export default Login;
