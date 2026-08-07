import axiosClient from "./axiosClient";

export const getIncidents = () => axiosClient.get("/incidents");
export const createIncident = (data) => axiosClient.post("/incidents", data);
export const getResponders = () => axiosClient.get("/responders");
export const getCameras = () => axiosClient.get("/cameras");
