import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import Loader from "./Loader"; // Import the Loader component

function ResetPassword() {
  const { id: userId, resetString } = useParams(); // Extract userId and resetString from URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // Manage loading state
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true); // Start the loader

    try {
      const response = await fetch(
        "https://song-dedication-backend.onrender.com/resetPassword",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, resetString, newPassword }),
        }
      );

      const data = await response.json();

      if (data.status === "SUCCESS") {
        toast.success("Password reset successful");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during password reset");
    } finally {
      setLoading(false); // Stop the loader
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
      <Toaster position="top-center" richColors />
      {loading ? (
        <Loader /> // Show the loader while resetting the password
      ) : (
        <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4 sm:mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Reset Password
          </h2>
          <form onSubmit={handleResetPassword}>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-gray-300 p-2 rounded-md mb-2 w-full"
              placeholder="New Password"
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 p-2 rounded-md mb-2 w-full"
              placeholder="Confirm New Password"
              required
            />
            <button
              type="submit"
              className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
            >
              Reset Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;
