import React, { useState } from "react";

function AdminDummy() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSignup = async () => {
    try {
<<<<<<< HEAD
      const result = await fetch("/api/adminSignup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Sumanth",
          email: "sumanth1222333@gmail.com",
          password: "Success35@",
        }),
      });
=======
      const result = await fetch(
        "http://song-dedication-env.eba-evmm8zs2.ap-south-1.elasticbeanstalk.com/adminSignup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "Sumanth",
            email: "sumanth1222333@gmail.com",
            password: "Success35@",
          }),
        }
      );
>>>>>>> f06f4e1ce27e9bfbb1591ed32997ae61a16d1d80

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
