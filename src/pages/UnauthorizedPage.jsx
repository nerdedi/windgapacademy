import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const UnauthorizedPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m0 0v2m0-2h2m-2 0H8m5-10a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 text-center mb-6">
            You don&apos;t have permission to access this page.
          </p>

          <div className="space-y-4">
            {user ? (
              <>
                <p className="text-sm text-gray-500">
                  Your current role: <span className="font-semibold">{user.role || "Student"}</span>
                </p>
                <div className="flex justify-center">
                  <Link
                    to={
                      user.role === "educator" || user.role === "admin"
                        ? "/educator-dashboard"
                        : "/learner-dashboard"
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Go to My Dashboard
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex justify-center">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Log In
                </Link>
              </div>
            )}

            <div className="flex justify-center mt-4">
              <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">
                Return to Home Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
