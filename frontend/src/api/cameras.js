import axiosClient from "./axiosClient";

export const getCameras = () => {
  return axiosClient.get("/cameras");
};
