import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import Loader from "../components/Loader"; // Import the Loader component

function Verification() {
  const navigate = useNavigate();
  const { userId, uniqueString } = useParams(); // Extract parameters from the URL
  const [loading, setLoading] = useState(true); // Manage loading state

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `https://song-dedication-backend.onrender.com/user/verify/${userId}/${uniqueString}`
        );
        const data = await response.json();

        if (data.success) {
          toast.success("Email Verified Successfully");
          setTimeout(() => {
            navigate("/login"); // Redirect to login page after 2 seconds
          }, 2000);
        } else {
          toast.error(data.error || "Verification Failed");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred during verification");
      } finally {
        setLoading(false); // Stop the loader
      }
    };

    verifyEmail();
  }, [userId, uniqueString, navigate]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
      <Toaster position="top-center" richColors />
      {loading ? (
        <Loader /> // Show the loader while verifying
      ) : (
        <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4 sm:mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Email Verification
          </h2>
          <p className="text-gray-700 text-center">
            Please wait while we verify your email...
          </p>
        </div>
      )}
    </div>
  );
}

export default Verification;
