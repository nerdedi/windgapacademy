import React, { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext.js";
import Login from "./components/Login.jsx";
import DashboardRouter from "./components/DashboardRouter.jsx";

function MainApp() {
  const { user } = useContext(AuthContext);
  if (!user) return <Login />;
  return <DashboardRouter />;
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
