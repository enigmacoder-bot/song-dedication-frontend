import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

function ForgotPasswordRequest() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://song-dedication-backend.onrender.com/requestResetpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, redirectUrl: 'http://localhost:3000/resetPassword' }),
      });
      const data = await response.json();

      if (data.status === 'PENDING') {
        toast.success('Password reset link sent to your email.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (data.status === 'FAILED') {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 p-4 sm:p-6">
      <Toaster position="top-center" richColors />
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
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
      </div>
    </div>
  );
}

export default ForgotPasswordRequest;
