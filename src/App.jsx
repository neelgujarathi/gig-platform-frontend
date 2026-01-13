import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PostGig from "./pages/PostGig";
import GigDetail from "./pages/GigDetail";
import Navbar from "./components/Navbar";
import EditGig from "./pages/EditGig";
import MyGigs from "./pages/MyGigs";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
       <ToastContainer position="top-right" autoClose={4000} />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post-gig" element={user ? <PostGig /> : <Navigate to="/login" />} />
          <Route path="/gig/:id" element={user ? <GigDetail /> : <Navigate to="/login" />} />
          <Route path="/edit-gig/:id" element={user ? <EditGig /> : <Navigate to="/login" />} />
          <Route path="/my-gigs" element={user ? <MyGigs /> : <Navigate to="/login" />} />

        </Routes>
      </div>
    </>
  );
}

export default App;
