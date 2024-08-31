import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Toaster, toast } from "sonner";

const SOCKET_SERVER_URL = "https://song-dedication-backend.onrender.com"; // Update with your server URL

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
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("initialRequests", (initialRequests) => {
      setRequests(initialRequests);
    });

    socket.on("newRequest", (newRequest) => {
      setRequests([...requests, newRequest]);
    });

    return () => {
      socket.off("initialRequests");
      socket.off("newRequest");
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
    <div className="font-sans min-h-screen flex flex-col bg-[#1f1d2b] text-white">
      <Toaster />
      <div
        className="bg-black text-white py-4 text-5xl font-bold text-center"
        style={{ fontFamily: '"Sevillana", cursive' }}
      >
        Dashboard
      </div>
      <div className="w-full max-w-xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Current Requests</h2>
        {requests.map((request, index) => (
          <div
            key={index}
            className="rounded-lg p-4 mb-4 bg-[#31abbd] text-white shadow-md"
          >
            <p className="text-lg font-semibold">
              {request.name} - {request.artist}
            </p>
            {request.requestedBy && (
              <p className="text-gray-200">
                Requested by: {request.requestedBy}
              </p>
            )}
            {request.message && (
              <p className="text-gray-200">Message: {request.message}</p>
            )}
            {request.isDedication && (
              <p className="text-gray-200">
                Dedicated to: {request.dedicatedTo}
              </p>
            )}
            {request.songLink && (
              <p className="text-gray-200">
                Song Link:{" "}
                <a
                  href={request.songLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:underline"
                >
                  {request.songLink}
                </a>
              </p>
            )}
          </div>
        ))}
      </div>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 self-center"
        onClick={() => setIsModalOpen(true)}
      >
        Make a Request
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Make a Request</h2>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md mb-2 w-full"
              placeholder="Song Name"
              value={newRequest.name}
              onChange={(e) =>
                setNewRequest({ ...newRequest, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md mb-2 w-full"
              placeholder="Artist"
              value={newRequest.artist}
              onChange={(e) =>
                setNewRequest({ ...newRequest, artist: e.target.value })
              }
              required
            />
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md mb-2 w-full"
              placeholder="Requested By (Optional)"
              value={newRequest.requestedBy}
              onChange={(e) =>
                setNewRequest({ ...newRequest, requestedBy: e.target.value })
              }
            />
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md mb-2 w-full"
              placeholder="Message (Optional)"
              value={newRequest.message}
              onChange={(e) =>
                setNewRequest({ ...newRequest, message: e.target.value })
              }
            />
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md mb-2 w-full"
              placeholder="Dedicated To (Optional)"
              value={newRequest.dedicatedTo}
              onChange={(e) =>
                setNewRequest({ ...newRequest, dedicatedTo: e.target.value })
              }
            />
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md mb-2 w-full"
              placeholder="Song Link (Optional)"
              value={newRequest.songLink}
              onChange={(e) =>
                setNewRequest({ ...newRequest, songLink: e.target.value })
              }
            />
            <div className="flex justify-end mt-4">
              <button
                className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2"
                onClick={handleRequest}
              >
                Request
              </button>
              <button
                className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2"
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
