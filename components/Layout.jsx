import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/global.css";

function Layout({ children }) {
  return (
    <div>
      <nav aria-label="Main navigation">
        <h2>Windgap Academy</h2>
        <NavLink to="/" end activeClassName="active">
          Home
        </NavLink>
        <NavLink to="/dashboard" activeClassName="active">
          Dashboard
        </NavLink>
        <NavLink to="/game" activeClassName="active">
          Game Zone
        </NavLink>
        <NavLink to="/calm" activeClassName="active">
          Calm Space
        </NavLink>
        <NavLink to="/avatar" activeClassName="active">
          Avatar
        </NavLink>
      </nav>
      <header>
        <h3>Welcome to Windgap Academy</h3>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
