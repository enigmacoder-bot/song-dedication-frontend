import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://song-dedication-backend.onrender.com/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );
      const data = await response.json();
      if (!data.error) {
        toast.success("Login Successful");
        window.localStorage.setItem("isAuthenticated", "true");
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
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-opacity-50">
      <Toaster position="top-center" richColors />
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
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
            className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg  text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          <a
            onClick={() => navigate("/forgotRequest")}
            className="text-blue-500 hover:cursor-pointer"
          >
            Forgot your password?
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
