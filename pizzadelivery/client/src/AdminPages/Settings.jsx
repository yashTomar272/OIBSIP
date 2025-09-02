import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Settings() {
  const [email, setEmail] = useState("tomarji272@gmail.com");
  const [threshold, setThreshold] = useState(13);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await axios.get("http://localhost:8000/api/email/logs"); // 🔹 backend API
        setLogs(res.data);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    }

    fetchLogs();

    // 🔄 har 10 sec baad refresh
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-2 settings-grid" style={{ gap: 20 }}>
      {/* Right card */}
      <div className="card" >
        <strong>📩 Notification Log (sent emails)</strong>

        {/* 👇 Scrollable tbody */}
        <div className="table-wrapper" >
          <table className="tablee">
            <thead>
              <tr>
                <th>When</th>
                <th>To</th>
                <th>Subject</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log._id}>
                    <td className="small">{new Date(log.sentAt).toLocaleString()}</td>
                    <td>{log.to}</td>
                    <td>{log.subject}</td>
                    <td
                      className="small"
                      style={{ color: log.status === "sent" ? "green" : "red" }}
                    >
                      {log.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                    No logs yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
