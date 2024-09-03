import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Toaster, toast } from "sonner";
import Loader from "../components/Loader";
import logo from "../novigo_logo.png";

const SOCKET_SERVER_URL = process.env.REACT_APP_API_BASE_URL;

function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

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

    socket.on("initialRequests", (initialRequests) => {
      setRequests(initialRequests);
      setLoading(false); // Stop loading when requests are received
    });

    socket.on("newRequest", (newRequest) => {
      setRequests((prevRequests) => [...prevRequests, newRequest]);
    });

    return () => {
      socket.off("initialRequests");
      socket.off("newRequest");
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

  // return (
  //   <div className="font-sans min-h-screen flex flex-col bg-[#1f1d2b] text-white">
  //     <Toaster />
  //     <div
  //       className="bg-black text-white py-4 text-5xl font-bold text-center"
  //       style={{ fontFamily: '"Sevillana", cursive' }}
  //     >
  //       Admin Dashboard
  //     </div>
  //     <div className="w-full max-w-xl mx-auto mt-8">
  //       <h2 className="text-2xl font-bold mb-4 text-center">Current Requests</h2>
  //       {loading ? (
  //         <div className="flex justify-center items-center h-64">
  //           <Loader /> {/* Display loader while requests are being fetched */}
  //         </div>
  //       ) : requests.length > 0 ? (
  //         requests.map((request) => (
  //           <div
  //             key={request._id}
  //             className="rounded-lg p-4 mb-4 bg-[#31abbd] text-white shadow-md"
  //           >
  //             <p className="text-lg font-semibold">
  //               {request.name} - {request.artist}
  //             </p>
  //             {request.requestedBy && (
  //               <p className="text-gray-200">Requested by: {request.requestedBy}</p>
  //             )}
  //             {request.message && (
  //               <p className="text-gray-200">Message: {request.message}</p>
  //             )}
  //             {request.isDedication && (
  //               <p className="text-gray-200">Dedicated to: {request.dedicatedTo}</p>
  //             )}
  //             {request.songLink && (
  //               <p className="text-gray-200">
  //                 Song Link:{' '}
  //                 <a
  //                   href={request.songLink}
  //                   target="_blank"
  //                   rel="noopener noreferrer"
  //                   className="text-blue-800 hover:underline"
  //                 >
  //                   {request.songLink}
  //                 </a>
  //               </p>
  //             )}
  //             <div className="flex justify-end mt-4">
  //               <button
  //                 className="bg-red-500 text-white py-1 px-3 rounded-lg"
  //                 onClick={() => handleDelete(request._id)}
  //               >
  //                 Delete
  //               </button>
  //             </div>
  //           </div>
  //         ))
  //       ) : (
  //         <p className="text-gray-700 text-center">No requests available</p>
  //       )}
  //     </div>
  //   </div>
  // );

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
        <h2 className="text-2xl font-bold mb-4 text-center">
          Current Requests
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : requests.length > 0 ? (
          requests.map((request) => (
            <div
              key={request._id}
              className="min-h-[7em] w-[90%] max-w-[40em] mx-auto border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] to-[rgba(75,30,133,0.01)] text-white font-nunito p-[1em] flex flex-col gap-[0.5em] backdrop-blur-[12px] mb-4"
            >
              <div className="flex flex-col gap-[0.5em]">
                <h1 className="text-[2em] font-medium mt-2">
                  {request.name} - {request.artist}
                </h1>
                <p className="text-[1.2em]">
                  Requested by Username: {request.requestedByUsername}
                </p>
                <p className="text-[1.2em]">
                  Requested by Email: {request.requestedByEmail}
                </p>
                {request.message && (
                  <p className="text-[1.2em]">Message: {request.message}</p>
                )}
                {request.isDedication && (
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
                  className="bg-red-500 text-white py-1 px-3 rounded-lg"
                  onClick={() => handleDelete(request._id)}
                >
                  Delete
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
