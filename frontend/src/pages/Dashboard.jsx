import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getFiles, uploadFile, deleteFile, downloadFile, shareFile } from "../services/fileService";
import { ThemeContext } from "../context/ThemeContext";
import { logout } from "../utils/auth";

function Dashboard() {

  const [files, setFiles] = useState([]);
  const [sharedLink, setSharedLink] = useState("");
  const [copied, setCopied] = useState(false);

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

  // 🔥 SHARE FUNCTION
  const handleShare = async (id) => {
    try {
      const data = await shareFile(id);

      setSharedLink(data.url);
      setCopied(false);

      // automātiski kopē
      await navigator.clipboard.writeText(data.url);
      setCopied(true);

    } catch (error) {
      console.error("Share failed", error);
      alert("Failed to generate share link");
    }
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
            style={buttonSmall}
          >
            Toggle Theme
          </button>

          <button
            onClick={handleLogout}
            style={logoutBtn}
          >
            Logout
          </button>

        </div>

      </div>

      {/* FILE UPLOAD */}
      <div style={{ marginBottom: "20px" }}>
        <input type="file" onChange={handleUpload} />
      </div>

      {/* 🔗 SHARE LINK BOX */}
      {sharedLink && (
        <div style={shareBox}>
          <p><strong>Share link:</strong></p>

          <input
            value={sharedLink}
            readOnly
            style={shareInput}
          />

          <button
            style={copyBtn}
            onClick={async () => {
              await navigator.clipboard.writeText(sharedLink);
              setCopied(true);
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}

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

                  <button
                    style={shareBtn}
                    onClick={() => handleShare(file.id)}
                  >
                    Share
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

// 🔹 STYLES

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
  marginRight: "10px",
  padding: "6px 12px",
  border: "none",
  background: "#f44336",
  color: "white",
  cursor: "pointer",
  borderRadius: "4px"
};

const shareBtn = {
  padding: "6px 12px",
  border: "none",
  background: "#2196F3",
  color: "white",
  cursor: "pointer",
  borderRadius: "4px"
};

const logoutBtn = {
  padding: "6px 12px",
  fontSize: "12px",
  cursor: "pointer",
  background: "#333",
  color: "white",
  border: "none",
  borderRadius: "4px"
};

const buttonSmall = {
  padding: "6px 12px",
  fontSize: "12px",
  cursor: "pointer"
};

const shareBox = {
  marginBottom: "20px",
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  background: "#f9f9f9"
};

const shareInput = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
  marginBottom: "10px"
};

const copyBtn = {
  padding: "6px 12px",
  background: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

export default Dashboard;