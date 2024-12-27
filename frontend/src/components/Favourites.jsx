import { useEffect, useState } from "react";
import axios from "axios";
import InputBox from "./InputBox";
import Loading from "./Loading";
import AllFavourites from "./AllFavourites";

export default function Favourites() {
  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const [favourites, setFavourites] = useState([]); // For all fetched favourites
  const [filteredFavourites, setFilteredFavourites] = useState([]); // For filtered results
  const [loading, setLoading] = useState(false); // For loading state

  // Fetch Favourites on Mount or Refresh Trigger
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        setLoading(true); // Start Loading

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("🚨 Token is missing from localStorage");
          setFavourites([]);
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/api/v1/favourite/allFavourite`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFavourites(response.data.favourites || []);
        setFilteredFavourites(response.data.favourites || []);
      } catch (error) {
        console.error(
          "❌ Error fetching favourites:",
          error.response?.data?.msg || error.message
        );
        setFavourites([]);
        setFilteredFavourites([]);
      } finally {
        setLoading(false); // Stop Loading
      }
    };

    fetchFavourites();
  }, []);

  // Filter Favourites on Search Query Change
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFavourites(favourites); // Show all if search is empty
    } else {
      const filtered = favourites.filter((favourite) =>
        `${favourite.personId.firstName} ${favourite.personId.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredFavourites(filtered);
    }
  }, [searchQuery, favourites]);

  return (
    <div className="py-4 px-6">
      <div className="w-full font-bold text-xl">Your Favourites</div>

      {/* Search Input */}
      <InputBox
        placeholder="Search favourites..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Loading Indicator */}
      {loading && <Loading message="Fetching favourites, please wait..." />}

      {/* Empty State */}
      {!loading && filteredFavourites.length === 0 && searchQuery && (
        <div className="text-gray-500">No matching favourites found</div>
      )}

      {!loading && filteredFavourites.length === 0 && !searchQuery && (
        <div className="text-gray-500 mt-2">No favourites found</div>
      )}

      {/* Display Favourites using AllFavourites */}
      {!loading && filteredFavourites.length > 0 && (
        <AllFavourites
          favourites={filteredFavourites}
          setFavourites={setFavourites} // Pass the refresh function
        />
      )}
    </div>
  );
}
