import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

function Signup() {
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      const data = await response.json();
      if (!data.error) {
        toast.success('Sign Up Successful');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error in Sign Up!');
    }
  };

  const redirectToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
      <Toaster position="top-center" richColors />
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            value={signupData.username}
            onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
            className="border border-gray-300 p-2 rounded-md mb-2 w-full"
            placeholder="Username"
            required
          />
          <input
            type="email"
            value={signupData.email}
            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            className="border border-gray-300 p-2 rounded-md mb-2 w-full"
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={signupData.password}
            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            className="border border-gray-300 p-2 rounded-md mb-2 w-full"
            placeholder="Password"
            required
          />
          <button type="submit" className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
            Signup
          </button>
        </form>
        <div className="mt-4">
          <p className="text-sm">
            Already have an account?{' '}
            <button onClick={redirectToLogin} className="text-blue-500 underline">
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
