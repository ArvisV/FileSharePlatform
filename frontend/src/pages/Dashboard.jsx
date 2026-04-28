import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getFiles, uploadFile, deleteFile, downloadFile } from "../services/fileService";
import { ThemeContext } from "../context/ThemeContext";
import { logout } from "../utils/auth";

function Dashboard() {

  const [files, setFiles] = useState([]);
  const { toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const fetchFiles = async () => {
    const data = await getFiles();
    setFiles(data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await uploadFile(file);
      await fetchFiles();
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this file?");
    if (!confirmDelete) return;

    await deleteFile(id);
    await fetchFiles();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{
      maxWidth: "900px",
      margin: "40px auto",
      fontFamily: "Arial"
    }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>

        <h1>Your Files</h1>

        <div style={{ display: "flex", gap: "10px" }}>

          <button
            onClick={toggleTheme}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            Toggle Theme
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              cursor: "pointer",
              background: "#333",
              color: "white",
              border: "none",
              borderRadius: "4px"
            }}
          >
            Logout
          </button>

        </div>

      </div>

      {/* FILE UPLOAD */}
      <div style={{ marginBottom: "20px" }}>
        <input type="file" onChange={handleUpload} />
      </div>

      {/* FILE TABLE */}
      <table style={{
        width: "100%",
        borderCollapse: "collapse"
      }}>

        <thead>
          <tr>
            <th style={thStyle}>File Name</th>
            <th style={thStyle}>Uploaded</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>

          {files.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ padding: "20px", textAlign: "center" }}>
                No files uploaded
              </td>
            </tr>
          ) : (

            files.map((file) => (
              <tr key={file.id}>

                <td style={tdStyle}>{file.fileName}</td>

                <td style={tdStyle}>
                  {new Date(file.uploadedAt).toLocaleString()}
                </td>

                <td style={tdStyle}>

                  <button
                    style={downloadBtn}
                    onClick={() => downloadFile(file.id)}
                  >
                    Download
                  </button>

                  <button
                    style={deleteBtn}
                    onClick={() => handleDelete(file.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

const thStyle = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "2px solid #ddd"
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee"
};

const downloadBtn = {
  marginRight: "10px",
  padding: "6px 12px",
  border: "none",
  background: "#4CAF50",
  color: "white",
  cursor: "pointer",
  borderRadius: "4px"
};

const deleteBtn = {
  padding: "6px 12px",
  border: "none",
  background: "#f44336",
  color: "white",
  cursor: "pointer",
  borderRadius: "4px"
};

export default Dashboard;