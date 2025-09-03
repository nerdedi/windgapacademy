import { Link } from "react-router-dom";
import { useUser } from "../app/UserContext";

const Navbar = () => {
  const { userId, setUserId } = useUser();

  const logout = () => {
    setUserId("");
  };

  return (
    <nav className="bg-[#5ED1D2] text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-xl">
        Windgap Academy
      </Link>
      <div className="space-x-4">
        {userId && <Link to="/student">Student</Link>}
        {userId && <Link to="/trainer">Trainer</Link>}
        <button onClick={logout} className="ml-4">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
