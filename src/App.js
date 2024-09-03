import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dedication from "./pages/Dedication";
import Verification from "./pages/Verification";
import AdminPage from "./pages/AdminPage";
import ForgotPasswordRequest from "./pages/ForgotPasswordRequest";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";
import AdminDummy from "./pages/AdminDummy";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
function App() {
  //const isAuthenticated = window.localStorage.getItem('isAuthenticated');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/dummy" element={<AdminDummy/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/adminLogin" element={<AdminLogin/>}/>

        <Route element={<ProtectedRoute />}>
          <Route path="/dedication" element={<Dedication />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/adminPage" element={<AdminPage />} />
        </Route>
        <Route path="/forgotRequest" element={<ForgotPasswordRequest />} />
        <Route
          path="/resetPassword/:id/:resetString"
          element={<ResetPassword />}
        />
         <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
