import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Toaster, toast } from "sonner";
import Loader from "../components/Loader";
import logo from "../novigo_logo.png";
import RevealCard from "../components/RevealCard";

const SOCKET_SERVER_URL = process.env.REACT_APP_API_BASE_URL;

function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [fadedRequests, setFadedRequests] = useState([]); // Track faded requests

  useEffect(() => {
    const token = localStorage.getItem("adminToken"); // Retrieve the JWT token

    if (!token) {
      window.location.href = "/adminLogin"; // Redirect to login if no token found
      return;
    }

    try {
      const newSocket = io(SOCKET_SERVER_URL, {
        auth: {
          token: token, // Send the token during connection
        },
      });

      // Listen for connection error events
      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);

        // If the error is related to authentication, navigate to login
        if (err.message === "Authentication error") {
          window.location.href = "/adminLogin";
        }
      });

      setSocket(newSocket);

      // Clean up the socket connection on component unmount
      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    } catch (error) {
      console.error("Socket connection error:", error);
      window.location.href = "/adminLogin";
    }
  }, []);

  useEffect(() => {
    if (!socket) return;
  
    // Handle initial requests (including completed ones)
    socket.on("initialRequests", (initialRequests) => {
      setRequests(initialRequests);
  
      // Identify which requests are completed and fade them out
      const completedRequests = initialRequests
        .filter((request) => request.completed) // Assuming 'completed' is a boolean field in the request object
        .map((request) => request._id); // Get the IDs of completed requests
  
      setFadedRequests(completedRequests); // Set the state for faded requests
  
      setLoading(false); // Stop loading when requests are received
    });
  
    // Handle new song requests
    socket.on("newRequest", (newRequest) => {
      setRequests((prevRequests) => [...prevRequests, newRequest]);
    });
  
    // Handle request updates (e.g., marking as completed)
    socket.on("requestUpdated", (updatedRequest) => {
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === updatedRequest._id ? updatedRequest : request
        )
      );
  
      // If the request is marked as completed, fade it out
      if (updatedRequest.completed) {
        setFadedRequests((prevFadedRequests) => [
          ...prevFadedRequests,
          updatedRequest._id,
        ]);
      } else {
        // If the request is no longer completed, remove it from faded requests
        setFadedRequests((prevFadedRequests) =>
          prevFadedRequests.filter((id) => id !== updatedRequest._id)
        );
      }
    });
  
    return () => {
      socket.off("initialRequests");
      socket.off("newRequest");
      socket.off("requestUpdated");
    };
  }, [socket]);
  


  const handleDelete = (requestId) => {
    if (!socket) return;

    socket.emit("deleteRequest", requestId, (response) => {
      if (response.success) {
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
        );
        toast.success("Request deleted successfully");
      } else {
        toast.error("Failed to delete request");
      }
    });
  };

  const handleMarkAsCompleted = (requestId) => {
    if (socket) {
      // Emit event to mark the request as completed
      socket.emit("markAsCompleted", requestId);
    }
  };

  return (
    <div className="font-sans min-h-screen flex flex-col bg-[#1f1d2b] text-white">
      <Toaster position="top-center" richColors />
  
      {/* Header Section */}
      <div className="bg-black text-white py-4 px-4 flex items-center relative">
        <img
          src={logo}
          alt="Logo"
          className="h-12 absolute top-5 left-9 hidden md:block transform scale-150"
        />
        <div className="flex-1 flex justify-center">
          <span
            style={{ fontFamily: '"Sevillana", cursive' }}
            className="text-3xl md:text-5xl font-bold"
          >
            Admin Dashboard
          </span>
        </div>
      </div>
  
      {/* Content Section */}
      <div className="w-full max-w-4xl mx-auto mt-8">
  <h2 className="text-2xl font-bold mb-4 text-center">Current Requests</h2>

  {loading ? (
    <div className="flex justify-center items-center h-64">
      <Loader />
    </div>
  ) : requests.length > 0 ? (
    requests.map((request) => (
      <div
        key={request._id}
        className={`relative min-h-[7em] w-[90%] max-w-[40em] mx-auto border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] to-[rgba(75,30,133,0.01)] text-white font-nunito p-[1em] flex flex-col gap-[0.5em] backdrop-blur-[12px] mb-4 transition-opacity duration-700 ${
          fadedRequests.includes(request._id) ? "opacity-50" : "opacity-100"
        }`}
      >
       <div className="flex flex-col gap-[0.5em]">
            <h1 className="text-[2em] font-medium mt-2">
                {request.name} - {request.artist}
            </h1>
            <p className="text-[1.2em]">
                User Details 
            </p>
            {/* Center-align the RevealCard without pushing it too far */}
            <p>
                <RevealCard value={`${request.requestedByUsername}-${request.requestedByEmail}`} />
            </p>
            {request.requestedBy && (
                <p className="text-[1.2em]">Dedicated by: {request.requestedBy}</p>
            )}
            {request.message && (
                <p className="text-[1.2em]">Message: {request.message}</p>
            )}
            {request.dedicatedTo && (
                <p className="text-[1.2em]">
                    Dedicated to: {request.dedicatedTo}
                </p>
            )}
            {request.songLink && (
                <p className="text-[1.2em]">
                    Song Link(↗):{" "}
                    <a
                        href={request.songLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-800 hover:underline"
                        style={{ color: "#033fff" }}
                    >
                        {request.songLink}
                    </a>
                </p>
            )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="bg-red-500 text-white py-1 px-3 rounded-lg mr-2"
            onClick={() => handleDelete(request._id)}
          >
            Delete
          </button>
          <button
            className="bg-green-500 text-white py-1 px-3 rounded-lg"
            onClick={() => handleMarkAsCompleted(request._id)}
          >
            Mark as Considered
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-700 text-center">No requests available</p>
  )}
</div>
    </div>
  );
  
  
  
}

export default AdminPage;
