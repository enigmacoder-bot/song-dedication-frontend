import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useState } from "react";
import Loader from "../components/Loader"; // Import the Loader component

function ForgotPasswordRequest() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Manage loading state
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true); // Start the loader
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/requestResetpassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (!data.error) {
        // Handle success (e.g., show a success message)
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error in requesting password reset!");
    } finally {
      setLoading(false); // Stop the loader
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 p-4 sm:p-6">
      <Toaster position="top-center" richColors />
      {loading ? (
        <Loader /> // Show the loader while sending the reset link
      ) : (
        <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Forgot Password
          </h2>
          <form onSubmit={handlePasswordReset}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 rounded-md mb-4 w-full"
              placeholder="Enter your email"
              required
            />
            <button
              type="submit"
              className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
            >
              Send Reset Link
            </button>
          </form>
          <span
            onClick={() => navigate("/login")}
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

export default ForgotPasswordRequest;
