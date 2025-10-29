import { useState } from "react";

export default function ReportPage() {
  const [loading, setLoading] = useState(false);

  const downloadAllUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/downloadAll");
      if (!res.ok) throw new Error("Failed to fetch data");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "all_users_report.json";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download report");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Make sure this `return` is inside the function!
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/images/background1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ color: "#603C1C", marginBottom: "20px" }}>
        Download All Users Report
      </h1>
      <button
        onClick={downloadAllUsers}
        disabled={loading}
        style={{
          padding: "12px 25px",
          fontSize: "1rem",
          backgroundColor: "rgba(240, 185, 35, 1)",
          color: "#603C1C",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {loading ? "Downloading..." : "Download Report"}
      </button>
    </div>
  );
}
