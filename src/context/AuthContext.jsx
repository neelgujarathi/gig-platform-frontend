import { createContext, useState, useEffect } from "react";
import API from "../api/api";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AuthContext = createContext();
let socket;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Auto-login from backend JWT cookie
  const fetchCurrentUser = async () => {
    try {
      const res = await API.get("/auth/me"); // new endpoint
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      console.log("No active session");
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    if (socket) socket.disconnect();

    socket = io("http://localhost:5000", { withCredentials: true });

    socket.on("connect", () => {
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
    await API.post("/auth/logout"); // optional: clear cookie on backend
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
