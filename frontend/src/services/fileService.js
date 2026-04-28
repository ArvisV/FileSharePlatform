import api from "./api";

export const getFiles = async () => {
  const response = await api.get("/files");
  return response.data;
};

export const uploadFile = async (file) => {

  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
};

export const deleteFile = async (id) => {
  await api.delete(`/files/${id}`);
};

export const shareFile = async (id) => {
  const response = await api.post(`/files/${id}/share`);
  return response.data;
};

export const downloadFile = async (id) => {

  const response = await api.get(`/files/${id}/download`, {
    responseType: "blob"
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));

  const link = document.createElement("a");
  link.href = url;

  let fileName = "download";

  const contentDisposition = response.headers["content-disposition"];

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?(.+)"?/);
    if (match && match[1]) {
      fileName = match[1];
    }
  }

  link.setAttribute("download", fileName);

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
};