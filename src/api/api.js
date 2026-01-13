import axios from "axios";

export default axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://gig-platform-backend.onrender.com/api",
  withCredentials: true,
});
