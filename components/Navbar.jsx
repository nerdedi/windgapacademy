import { Link } from "react-router-dom";
import { useUser } from "../src/app/UserContext";

const Navbar = () => {
  const { user, logout } = useUser();

  return (
    <nav className="bg-[#5ED1D2] text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-xl">
        Windgap Academy
      </Link>
      <div className="space-x-4">
        {user?.role === "student" && <Link to="/student">Student</Link>}
        {user?.role === "trainer" && <Link to="/trainer">Trainer</Link>}
        {user ? (
          <button onClick={logout} className="ml-4">
            Logout
          </button>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
