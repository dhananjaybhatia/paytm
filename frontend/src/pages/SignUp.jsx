import { useState } from "react";
import BottomWarning from "../components/BottomWarning";
import Button from "../components/Button";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import SubHeading from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Access the API base URL from environment variables
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const VITE_AUTH_TOKEN_NAME = import.meta.env.VITE_AUTH_TOKEN_NAME;

  const validateInputs = () => {
    if (!firstName || !lastName || !email || !password) {
      alert("All fields are required!");
      return false;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;
    setIsLoading(true);
    try {
      const response = await axios.post(`${VITE_API_BASE_URL}/user/signup`, {
        email,
        firstName,
        lastName,
        password,
      });

      localStorage.setItem(VITE_AUTH_TOKEN_NAME, response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg || "Something went wrong!");
      } else {
        alert("Network error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center">
      {isLoading ? (
        <Loading message={"Singing Up"} />
      ) : (
        <div className="flex flex-col justify-center">
          <div className="rounded-lg bg-white w-full max-w-sm text-center p-2 h-max px-4">
            <Heading label={"Sign up"} />
            <SubHeading label={"Enter your information to create an account"} />
            <InputBox
              label={"First Name"}
              placeholder={"Your Name"}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <InputBox
              label={"Last Name"}
              value={lastName}
              placeholder={"Your Name"}
              onChange={(e) => setLastName(e.target.value)}
            />
            <InputBox
              label={"Email"}
              value={email}
              placeholder={"Your Email"}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputBox
              label={"Password"}
              value={password}
              placeholder={"******"}
              onChange={(e) => setPassword(e.target.value)}
              type={"password"}
            />
            <Button
              label={isLoading ? "Signing up..." : "Sign up"}
              onClick={handleSignUp}
            />

            <BottomWarning
              label={"Already have an account?"}
              buttonText={"Sign In"}
              to={"/SignIn"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
