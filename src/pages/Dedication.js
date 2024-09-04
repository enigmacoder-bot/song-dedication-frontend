import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Toaster, toast } from "sonner";
import Loader from "../components/Loader"; // Import the Loader component
import { useNavigate } from "react-router-dom";
import logo from "../novigo_logo.png"; // Adjust the path as needed

const SOCKET_SERVER_URL = process.env.REACT_APP_API_BASE_URL;

function Dedication() {
  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    name: "",
    artist: "",
    requestedBy: "", // Optional field
    message: "",
    dedicatedTo: "",
    songLink: "", // Optional field
    isDedication: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // State to manage loading
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve the JWT token

    if (!token) {
      window.location.href = "/login"; // Redirect to login if no token found
      return;
    }

    try {
      const newSocket = io(`${process.env.REACT_APP_API_BASE_URL}`, {
        auth: {
          token: token, // Send the token during connection
        },
      });

      // Listen for connection error events
      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);

        // If the error is related to authentication, navigate to login
        if (err.message === "Authentication error") {
          navigate("/login");
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
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("initialRequests", (initialRequests) => {
      setRequests(initialRequests);
      setLoading(false); // Stop loading when requests are received
    });

    socket.on("newRequest", (newRequest) => {
      setRequests([...requests, newRequest]);
    });
    socket.on("requestDeleted", (requestId) => {
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
    });

    return () => {
      socket.off("initialRequests");
      socket.off("newRequest");
      socket.off("requestDeleted");
    };
  }, [socket, requests]);

  const handleRequest = () => {
    if (!socket) return;

    socket.emit("newRequest", newRequest);
    setNewRequest({
      name: "",
      artist: "",
      requestedBy: "", // Reset optional field after request
      message: "",
      dedicatedTo: "",
      songLink: "", // Reset optional field after request
      isDedication: false,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="font-sans min-h-screen flex flex-col bg-[#1f1d2b] text-white relative">
      <Toaster />

      <div
        className="bg-black text-white py-4 text-5xl font-bold text-center"
        style={{ fontFamily: '"Sevillana", cursive' }}
      >
        Song Dedication
      </div>
      <img
        src={logo}
        alt="Logo"
        className="h-12 absolute top-5 left-9 hidden md:block transform scale-150"
      />
      <div className="w-full max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Current Requests
        </h2>
        {loading ? (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-white">
            <Loader />
          </div>
        ) : (
          requests.map((request, index) => (
            <div
              key={index}
              className="min-h-[7em] w-[90%] max-w-[40em] mx-auto border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] to-[rgba(75,30,133,0.01)] text-white font-nunito p-[1em] flex flex-col gap-[0.5em] backdrop-blur-[12px] mb-4"
            >
              <div className="flex flex-col gap-[0.5em]">
                <h1 className="text-[2em] font-medium mt-2">
                  {request.name} - {request.artist}
                </h1>
                {request.requestedBy && (
                  <p className="text-[1.2em]">
                    Requested by: {request.requestedBy}
                  </p>
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
            </div>
          ))
        )}
      </div>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 self-center transform -translate-y-2"
        onClick={() => setIsModalOpen(true)}
      >
        Make a Request
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md md:max-w-lg lg:max-w-xl">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
              Make a Request
            </h2>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md mb-2 w-full text-black"
              placeholder="Song Name"
              value={newRequest.name}
              onChange={(e) =>
                setNewRequest({ ...newRequest, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md mb-2 w-full text-black"
              placeholder="Artist"
              value={newRequest.artist}
              onChange={(e) =>
                setNewRequest({ ...newRequest, artist: e.target.value })
              }
              required
            />
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md mb-2 w-full text-black"
              placeholder="Requested By (Optional)"
              value={newRequest.requestedBy}
              onChange={(e) =>
                setNewRequest({ ...newRequest, requestedBy: e.target.value })
              }
            />
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md mb-2 w-full text-black"
              placeholder="Message (Optional)"
              value={newRequest.message}
              onChange={(e) =>
                setNewRequest({ ...newRequest, message: e.target.value })
              }
            />
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md mb-2 w-full text-black"
              placeholder="Dedicated To (Optional)"
              value={newRequest.dedicatedTo}
              onChange={(e) =>
                setNewRequest({ ...newRequest, dedicatedTo: e.target.value })
              }
            />
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md mb-2 w-full text-black"
              placeholder="Song Link (Optional)"
              value={newRequest.songLink}
              onChange={(e) =>
                setNewRequest({ ...newRequest, songLink: e.target.value })
              }
            />
            <div className="flex flex-col md:flex-row justify-end mt-4 space-y-2 md:space-y-0 md:space-x-2">
              <button
                className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5"
                onClick={handleRequest}
              >
                Request
              </button>
              <button
                className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dedication;
