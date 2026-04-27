import axiosClient from "./axiosClient";

export const getIncidents=()=>{
    return axiosClient.get("/incidents");
};

export const createIncident=(data)=>{
    return axiosClient.post("/incidents",data);
};