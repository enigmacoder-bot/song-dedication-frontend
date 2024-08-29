// Verification.js
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

function Verification() {
  const navigate = useNavigate();
  const { userId, uniqueString } = useParams(); // Extract parameters from the URL

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/verify/${userId}/${uniqueString}`);
        const data = await response.json();

        if (data.success) {
          toast.success('Email Verified Successfully');
          setTimeout(() => {
            navigate('/login'); // Redirect to login page after 2 seconds
          }, 2000);
        } else {
          toast.error(data.error || 'Verification Failed');
        }
      } catch (error) {
        console.error(error);
        toast.error('An error occurred during verification');
      }
    };

    verifyEmail();
  }, [userId, uniqueString, navigate]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
      <Toaster position="top-center" richColors />
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        <p className="text-gray-700">Please wait while we verify your email...</p>
      </div>
    </div>
  );
}

export default Verification;
