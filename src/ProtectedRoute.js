import React, { useEffect, useState } from "react";
import { useNavigate, Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAdminRoute = location.pathname === "/adminPage";
    const token = isAdminRoute
      ? localStorage.getItem("adminToken")
      : localStorage.getItem("token");

    if (!token) {
      // Redirect to appropriate login page based on the route
      navigate(isAdminRoute ? "/adminLogin" : "/login");
    } else {
      setAuthenticated(true);
    }
    setLoading(false);
  }, [navigate, location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return authenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to={location.pathname === "/adminPage" ? "/adminLogin" : "/login"}
    />
  );
}

export default ProtectedRoute;
