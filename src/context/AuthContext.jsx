import { createContext, useState, useEffect } from "react";
import API from "../api/api";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AuthContext = createContext();
let socket;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  //Fetch current logged-in user
  const fetchCurrentUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch {
      console.log("No active session");
    }
  };

  useEffect(() => fetchCurrentUser(), []);

  useEffect(() => {
    if (!user) return;
    if (socket) socket.disconnect();

    socket = io(import.meta.env.VITE_API_URL?.replace("/api", "") || "https://gig-platform-backend.onrender.com", {
      withCredentials: true,
      path: "/socket.io",
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("registerUser", user._id.toString());
    });

    socket.on("hired", (data) => {
      if (data.freelancerId.toString() === user._id.toString()) {
        toast.success(data.message, { autoClose: 5000 });
      }
    });

    return () => {
      socket.off("hired");
      socket.disconnect();
    };
  }, [user]);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data.user;
  };

  const register = async (name, email, password) => {
    const res = await API.post("/auth/register", { name, email, password });
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data.user;
  };

  const logout = async () => {
    await API.post("/auth/logout");
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
