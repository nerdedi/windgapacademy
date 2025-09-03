import { Link } from "react-router-dom";

import { useUser } from "../app/UserContext";

const Navbar = () => {
  const { user, logout } = useUser();

  const role = user?.role || null;
  // prefer new vocabulary but support legacy strings
  const isLearner = role === "learner" || role === "student";
  const isEducator = role === "educator" || role === "trainer";

  return (
    <nav className="bg-[#5ED1D2] text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-xl">
        Windgap Academy
      </Link>
      <div className="space-x-4">
        {isLearner && <Link to="/learner">Learner</Link>}
        {isEducator && <Link to="/educator">Educator</Link>}
        {user ? (
          <button onClick={logout} className="ml-4">
            Logout
          </button>
        ) : (
          <Link to="/" className="ml-4">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
