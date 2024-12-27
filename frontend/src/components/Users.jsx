import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

import { useEffect, useState } from "react";
import InputBox from "./InputBox";
import Loading from "./Loading";
import MapUsers from "./MapUsers";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const [users, setUsers] = useState([]); // For storing fetched users
  const [loading, setLoading] = useState(false); // For loading state

  const navigate = useNavigate(); // Hook for redirection

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        // Get userId from localStorage
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        // Check if the user is authenticated
        if (!token || !userId) {
          alert("⚠️ Please sign in to access the Search Users page.");
          navigate("/signin");
          return;
        }

        // Correctly interpolate searchQuery and excludeUserId
        const response = await axios.get(
          `http://localhost:8000/api/v1/user/allUsers?filter=${encodeURIComponent(
            searchQuery
          )}&excludeUserId=${userId}`
        );

        setUsers(response.data.users || []); // Update users from response
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setUsers([]); // Clear users on error
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    // Debounce mechanism to avoid excessive API calls
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchUsers();
      } else {
        setUsers([]); // Clear users if searchQuery is empty
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout
  }, [searchQuery, navigate]);

  return (
    <div className="py-4 px-6">
      <div className="w-full font-bold text-xl">Search Users</div>

      {/* Search Input */}
      <InputBox
        placeholder="User search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Loading Indicator */}
      {loading && <Loading message="Fetching users, please wait..." />}

      {/* Display Users */}
      {!loading && users.length > 0 && <MapUsers users={users} />}
      {!loading && users.length === 0 && searchQuery && (
        <div className="text-gray-500">No users found</div>
      )}
    </div>
  );
}
