import axiosClient from "./axiosClient";

export const getResponders = () => {
  return axiosClient.get("/responders");
};

export const createResponder = (data) => {
  return axiosClient.post("/responders", data);
};
