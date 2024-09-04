import React, { useState } from "react";

function AdminDummy() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSignup = async () => {
    try {
      const result = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/adminSignup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "username": "admin",
            "email": "admin@gmail.com",
            "password": "Admin@2024"
          }),
        }
      );

      const data = await result.json();

      if (result.ok) {
        setResponse(data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Network error");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Admin Signup</h1>
      <button onClick={handleSignup} className="signup-button">
        Sign Up
      </button>
      {response && (
        <div className="response">
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div className="error">
          <h2>Error:</h2>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
}

export default AdminDummy;
