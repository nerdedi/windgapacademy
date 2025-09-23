import React, { useState, useRef, useEffect } from "react";
import {
  FaUser,
  FaSignOutAlt,
  FaUserShield,
  FaUserCog,
  FaChevronDown,
  FaLock,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

/**
 * DashboardHeader component with authentication integration
 * Provides user dropdown menu with authentication actions
 */
function DashboardHeader() {
  const { currentUser, logOut, hasRole } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
                Windgap Academy
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className="border-b-2 border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Dashboard
              </Link>

              <Link
                to="/learning-path"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Learning Path
              </Link>

              <Link
                to="/resources"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Resources
              </Link>

              {/* Conditional educator links */}
              {hasRole("educator") && (
                <>
                  <Link
                    to="/students"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Students
                  </Link>
                  <Link
                    to="/curriculum-builder"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Curriculum Builder
                  </Link>
                </>
              )}

              {/* Conditional admin links */}
              {hasRole("admin") && (
                <Link
                  to="/admin"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>

          {/* User dropdown */}
          <div className="flex items-center">
            <div className="ml-3 relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <div className="h-9 w-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">
                  <FaUser />
                </div>
                <span className="text-gray-700 font-medium hidden sm:block">
                  {currentUser?.displayName || currentUser?.email?.split("@")[0] || "User"}
                </span>
                <FaChevronDown className="ml-1 text-gray-400" />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                  <div className="py-1">
                    <div className="block px-4 py-2 text-sm text-gray-900">
                      <div className="font-medium">
                        {currentUser?.displayName || currentUser?.email?.split("@")[0]}
                      </div>
                      <div className="text-gray-500 truncate">{currentUser?.email}</div>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaUserCog className="mr-3 text-gray-500" />
                      Profile Settings
                    </Link>

                    <Link
                      to="/setup-mfa"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaLock className="mr-3 text-gray-500" />
                      Security Settings
                    </Link>

                    {hasRole("admin") && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaUserShield className="mr-3 text-gray-500" />
                        Admin Dashboard
                      </Link>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full text-left items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      <FaSignOutAlt className="mr-3 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
