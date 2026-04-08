import { useEffect, useState } from "react";
import { getFiles, uploadFile } from "../services/fileService";

function Dashboard() {

  const [files, setFiles] = useState([]);

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

  return (

    <div style={{
      maxWidth: "800px",
      margin: "40px auto",
      fontFamily: "Arial"
    }}>

      <h1>Your Files</h1>

      <div style={{ marginBottom: "20px" }}>
        <input type="file" onChange={handleUpload} />
      </div>

      <table style={{
        width: "100%",
        borderCollapse: "collapse"
      }}>

        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={thStyle}>File Name</th>
            <th style={thStyle}>Uploaded</th>
          </tr>
        </thead>

        <tbody>

          {files.length === 0 ? (
            <tr>
              <td colSpan="2" style={{ padding: "20px", textAlign: "center" }}>
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

export default Dashboard;