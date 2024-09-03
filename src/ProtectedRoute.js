import React, { useEffect, useState } from "react";
import { useNavigate, Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if no token is found
    } else {
      setAuthenticated(true); // Allow access if the token exists
    }
    setLoading(false); // Stop loading once authentication check is done
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while checking authentication
  }

  // Use <Outlet /> to render child routes if authenticated
  return authenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
