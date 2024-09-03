import React from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import Loader from "../components/Loader"; // Import the Loader component

function NotFound() {
  const navigate = useNavigate();

  const redirectHome = () => {
    navigate("/"); // Redirect to the home page
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 px-4 sm:px-0">
      <Toaster position="top-center" richColors />
      <div className="bg-white p-6 rounded-lg w-full max-w-sm sm:max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">404 - Page Not Found</h2>
        <p className="text-center mb-4">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <button
          onClick={redirectHome}
          className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
}

export default NotFound;
