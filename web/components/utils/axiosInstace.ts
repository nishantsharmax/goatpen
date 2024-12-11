import axios from "axios";

const api: any = axios.create({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin + "/api"
      : "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
