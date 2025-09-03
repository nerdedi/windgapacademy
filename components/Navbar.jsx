import { Link } from "react-router-dom";
import { useUser } from "../src/app/UserContext";

const Navbar = () => {
  const { user, logout } = useUser();

  return (
    <nav aria-label="Main navigation" className="bg-[#5ED1D2] text-white p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          Windgap Academy
        </Link>
        <ul className="flex items-center space-x-4" role="menu">
      {user?.role === "learner" && (
            <li role="none">
              <Link
                role="menuitem"
        to="/learner"
                className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
        Learner
              </Link>
            </li>
          )}
      {user?.role === "educator" && (
            <li role="none">
              <Link
                role="menuitem"
        to="/educator"
                className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
        Educator
              </Link>
            </li>
          )}
          {user ? (
            <li role="none">
              <button
                type="button"
                onClick={logout}
                className="ml-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                Logout
              </button>
            </li>
          ) : null}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
