import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";

export default function AppBar() {
  const navigate = useNavigate();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // Function to convert a name to proper case
  const toProperCase = (name) => {
    return name
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Full name in proper case
  const fullName = toProperCase(`${user?.firstName || ""}`);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    // setIsAuthenticated(false);
    navigate("/signin");
  };

  return (
    <div className="w-full flex justify-between items-center border-b-2 border-gray-100 py-4 px-6 shadow-md bg-white">
      {/* Left Section: Logo */}
      <Link
        to="/"
        className="font-bold text-lg cursor-pointer transition-transform transform hover:scale-105 duration-200 ease-in-out"
      >
        PayTM: Payments App
      </Link>

      {/* Center Section: Navigation Links */}
      <div className="flex gap-6">
        <Link
          to="/"
          className="font-medium text-gray-700 hover:text-green-600 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/favouriteDashboard"
          className="font-medium text-gray-700 hover:text-green-600 transition-colors"
        >
          Favourite
        </Link>
        <Link
          to="/profile"
          className="font-medium text-gray-700 hover:text-green-600 transition-colors"
        >
          Profile
        </Link>
      </div>

      {/* Right Section: User Greeting and Sign Out */}

      <div className="flex items-center whitespace-nowrap gap-4">
        <div className="font-semibold text-gray-700">
          Hello, {user ? `${fullName}` : "Guest"}
        </div>
        {user ? (
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Sign Out
          </button>
        ) : (
          <Link
            to="/signin"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium inline-block"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
