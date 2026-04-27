import axios from "axios";

const axiosClient=axios.create({
    baseURL: "http://localhost:4000", // backend URL
  headers: {
    "Content-Type": "application/json",
  },
})
export default axiosClient;