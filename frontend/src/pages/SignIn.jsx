import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomWarning from "../components/BottomWarning";
import Button from "../components/Button";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import SubHeading from "../components/SubHeading";
import Loading from "../components/Loading";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Access the API base URL from environment variables
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const VITE_AUTH_TOKEN_NAME = import.meta.env.VITE_AUTH_TOKEN_NAME;

  const validateInputs = () => {
    if (!email || !password) {
      alert("All fields are required!");
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateInputs()) return; // Check inputs before starting loading state
    setIsLoading(true); // Set loading state to true before the API call
    try {
      const response = await axios.post(`${VITE_API_BASE_URL}/user/signin`, {
        email,
        password,
      });

      // Save token and navigate to dashboard
      localStorage.setItem(VITE_AUTH_TOKEN_NAME, response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("userId", response.data.userId);

      navigate("/");
    } catch (error) {
      // Handle error responses
      if (error.response) {
        alert(error.response.data.msg || "Invalid email or password");
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
        <Loading message={"loading..."} />
      ) : (
        <div className="flex flex-col justify-center">
          <div className="rounded-lg bg-white w-full max-w-sm text-center p-2 h-max px-4">
            <Heading label={"Sign In"} />
            <SubHeading
              label={" Please enter your registered email and password"}
            />
            <InputBox
              label={"Email"}
              value={email}
              placeholder={"Your Email"}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputBox
              label={"Password"}
              type={"password"}
              value={password}
              placeholder={"Your Password"}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button label={"Sign In"} onClick={handleSignIn} />
            <BottomWarning
              label={"Don't have an account?"}
              buttonText={"Sign up"}
              to={"/Signup"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
