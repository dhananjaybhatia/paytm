import { Navigate } from "react-router-dom";

/* eslint-disable react/prop-types */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token"); // Check for auth token

  if (!token) {
    // Redirect to SignIn page if no token exists
    alert("⚠️ Please sign in to access this page.");
    return <Navigate to="/signin" replace />;
  }

  return children;
}
