import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Toaster, toast } from 'sonner';

const SOCKET_SERVER_URL = 'https://song-dedication-backend.onrender.com'; // Update with your server URL

function AdminPage() {
  const [requests, setRequests] = useState([]);
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

    socket.on('initialRequests', (initialRequests) => {
      setRequests(initialRequests);
    });

    socket.on('newRequest', (newRequest) => {
      setRequests([...requests, newRequest]);
    });

    return () => {
      socket.off('initialRequests');
      socket.off('newRequest');
    };
  }, [socket, requests]);

  const handleDelete = (requestId) => {
    console.log("Handle delete clicked");
    console.log('socket',socket);
    if (!socket) return;

    socket.emit('deleteRequest', requestId, (response) => {
      if (response.success) {
        setRequests(requests.filter(request => request._id !== requestId));
        toast.success('Request deleted successfully');
      } else {
        toast.error('Failed to delete request');
      }
    });
  };

  return (
    <div className="font-sans min-h-screen flex flex-col bg-gray-300">
      <Toaster />
      <div className="bg-black text-white py-4 text-3xl font-bold text-center">Admin Dashboard</div>
      <div className="w-full max-w-xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Current Requests</h2>
        {requests.map((request, index) => (
          <div key={index} className={`rounded-lg p-4 mb-4 bg-white shadow-md`}>
            <p className="text-lg">{request.name} - {request.artist}</p>
            <p className="text-gray-700">Requested by: {request.requestedBy}</p>
            {request.message && <p className="text-gray-700">Message: {request.message}</p>}
            {request.isDedication && <p className="text-gray-700">Dedicated to: {request.dedicatedTo}</p>}
            <button
              className="bg-red-500 text-white py-1 px-3 rounded-lg mt-2"
              onClick={() => handleDelete(request._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;
