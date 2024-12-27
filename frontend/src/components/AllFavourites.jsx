/* eslint-disable react/prop-types */
import { useState } from "react";
import Button from "./Button";
import axios from "axios";
import SendMoney from "./SendMoney";

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

// Component to Render All Favourites
export default function AllFavourites({ favourites, setFavourites }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleModal = (user) => {
    setSelectedUser({
      id: user._id,
      fullName: `${toProperCase(user.personId.firstName)} ${toProperCase(
        user.personId.lastName
      )}`,
      initials: getInitials(user.personId.firstName, user.personId.lastName),
    });
    setOpenModal(true); // Open the modal
  };

  const handleDelete = async (favouriteId) => {
    try {
      if (!favouriteId) {
        throw new Error("favouriteId is undefined or empty");
      }

      const stringId = String(favouriteId).trim();
      const encodedId = encodeURIComponent(stringId);

      const response = await axios.delete(
        `http://localhost:8000/api/v1/favourite/delete?favouriteId=${encodedId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Delete Response:", response.data);
      alert("Favourite user successfully deleted");
      // Update the local state without refreshing the whole list
      setFavourites((prevFavourites) =>
        prevFavourites.filter((favourite) => favourite._id !== favouriteId)
      );
    } catch (error) {
      console.error(
        "Error deleting item:",
        error.response?.data?.error || error.message
      );
      alert("Failed to delete item");
    }
  };

  return (
    <ul>
      {favourites.map((favourite) => {
        const initials = getInitials(
          favourite.personId.firstName,
          favourite.personId.lastName
        );
        const fullName = `${toProperCase(
          favourite.personId.firstName
        )} ${toProperCase(favourite.personId.lastName)}`;

        return (
          <li key={favourite._id} className="flex items-center m-4">
            {/* User Initials */}
            <div className="flex items-center justify-center bg-gray-300 text-white rounded-full w-10 h-10 text-lg font-semibold mr-4">
              {initials}
            </div>

            {/* User Details */}
            <div>
              <div className="font-semibold">{fullName}</div>
              <div className="font-semibold text-gray-500">
                {favourite.personId.email}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="ml-auto flex justify-between gap-4">
              <Button
                className="bg-red-500 hover:bg-red-600"
                label={"Remove"}
                onClick={() => handleDelete(favourite._id)}
              />
              {/* <Button label={"Send Money"} onClick={handleModal} /> */}
              <Button
                label={"Send Money"}
                onClick={() =>
                  handleModal({
                    _id: favourite._id,
                    personId: favourite.personId,
                  })
                }
              />
              {openModal && (
                <SendMoney
                  onClose={() => setOpenModal(false)}
                  fullName={selectedUser.fullName}
                  initials={selectedUser.initials}
                  id={selectedUser.id}
                />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
