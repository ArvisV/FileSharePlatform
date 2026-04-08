import api from "./api";

export const getFiles = async () => {
  const response = await api.get("/files");
  return response.data;
};