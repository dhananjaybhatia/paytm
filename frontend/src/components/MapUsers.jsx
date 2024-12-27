/* eslint-disable react/prop-types */
import { useState } from "react";
import Button from "./Button";
import axios from "axios";
import Loading from "./Loading";

export default function MapUsers({ users }) {
  const [loading, setLoading] = useState(false); // Loading state for API call
  const [favourites, setFavourites] = useState([]); // Array to store favorite users

  // Function to calculate initials
  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  // Function to convert a name to proper case
  const toProperCase = (name) => {
    return name
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Function to handle adding a user to favourites
  const handleFavourite = async (userId) => {
    setLoading(true); // Start loading
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

      const response = await axios.post(
        "http://localhost:8000/api/v1/favourite",
        {
          personId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
        }
      );

      const newFavourite = response.data.favourite;

      // Update local state with the new favorite
      setFavourites((prevFavourites) => [...prevFavourites, newFavourite]);

      alert("User added to favourites successfully!");
    } catch (error) {
      console.error(
        "Error adding to favourites:",
        error.response?.data?.msg || error.message
      );
      alert("User already exist in favourites.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Check if a user is already in the favourites list
  const isFavourite = (userId) => {
    return favourites.some(
      (fav) => fav.personId.toString() === userId.toString()
    );
  };

  return (
    <div className="mt-4">
      {users.length > 0 ? (
        users.map((user) => {
          const initials = getInitials(user.firstName, user.lastName);
          const fullName = `${toProperCase(user.firstName)} ${toProperCase(
            user.lastName
          )}`;

          return (
            <div key={user._id} className="flex items-center m-4">
              <div className="flex items-center justify-center bg-gray-300 text-white rounded-full w-10 h-10 text-lg font-semibold mr-4">
                {initials}
              </div>

              <div>
                <div className="font-semibold">{fullName}</div>
                <div className="font-semibold text-gray-500">{user.email}</div>
              </div>

              <div className="ml-auto flex justify-between gap-4">
                <Button
                  className={`${
                    isFavourite(user._id)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                  label={
                    isFavourite(user._id) ? "Already Added" : "Add to Favourite"
                  }
                  onClick={() =>
                    !isFavourite(user._id) && handleFavourite(user._id)
                  }
                  disabled={isFavourite(user._id)} // Disable button if already added
                />
                <Button
                  label={"Send Money"}
                  onClick={() => alert(`Send Money to ${fullName}`)}
                />
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-gray-500">No users found</div>
      )}

      {/* Show loading indicator */}
      {loading && <Loading message="Processing, please wait..." />}
    </div>
  );
}
