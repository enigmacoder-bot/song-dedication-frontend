import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import Loader from "../components/Loader";

function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Hi Hacker :)");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );
      const data = await response.json();
      if (!data.error) {
        toast.success("Login Successful");
        console.log("Token: ", data.token);
        // Store JWT in localStorage
        window.localStorage.setItem("token", data.token);
        setTimeout(() => {
          navigate("/dedication");
        }, 2000);
      } else if (data.status === 404) {
        toast.error("Please Verify Your Email to Login");
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 p-4 sm:p-6">
      <Toaster position="top-center" richColors />
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4 sm:mx-auto relative">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-md mb-2 w-full"
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-md mb-2 w-full"
              placeholder="Password"
              required
            />
            <button
              type="submit"
              className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600 text-center">
            <a
              onClick={() => navigate("/forgotRequest")}
              className="text-blue-500 hover:cursor-pointer"
            >
              Forgot your password?
            </a>
          </p>
          <span
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 cursor-pointer text-gray-600 hover:text-gray-900"
            aria-label="Go back"
          >
            {/* Backward Arrow Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
}

export default Login;
