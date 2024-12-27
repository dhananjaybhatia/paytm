import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import SubHeading from "../components/SubHeading";
import Loading from "../components/Loading";

export default function Profile() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Access the API base URL from environment variables
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const VITE_AUTH_TOKEN_NAME = import.meta.env.VITE_AUTH_TOKEN_NAME;

  const handleChangePassword = async () => {
    if (!password || !newPassword) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.put(
        `${VITE_API_BASE_URL}/user/changePassword`,
        {
          currentPassword: password,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              `${VITE_AUTH_TOKEN_NAME}`
            )}`, // Adjust for your auth strategy
          },
        }
      );

      alert(response.data.msg || "Password changed successfully!");
      await navigate("/");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg || "An error occurred.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setPassword("");
      setNewPassword("");
    }
  };
  return (
    <div className="h-screen flex justify-center">
      {isLoading ? (
        <Loading message={"loading..."} />
      ) : (
        <div className="flex flex-col justify-center">
          <div className="rounded-lg bg-white w-full max-w-sm text-center p-2 h-max px-4">
            <Heading label={"Change Password"} />
            <SubHeading
              label={" Please enter your current password and new password"}
            />
            <InputBox
              label={"Current Password"}
              value={password}
              type={"password"}
              placeholder={"Current Password"}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputBox
              label={"New Password"}
              type={"password"}
              value={newPassword}
              placeholder={"New Password"}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button label={"Change Password"} onClick={handleChangePassword} />
          </div>
        </div>
      )}
    </div>
  );
}
