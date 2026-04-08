import { useEffect, useState } from "react";
import { getFiles } from "../services/fileService";

function Dashboard() {

  const [files, setFiles] = useState([]);

  useEffect(() => {

    const fetchFiles = async () => {
      try {
        const data = await getFiles();
        setFiles(data);
      } catch (error) {
        console.error("Failed to load files", error);
      }
    };

    fetchFiles();

  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>

      <h1>Your Files</h1>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Uploaded</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>{file.fileName}</td>
              <td>{new Date(file.uploadedAt).toLocaleString()}</td>

              <td>
                <button>Download</button>
                <button style={{ marginLeft: "10px" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Dashboard;