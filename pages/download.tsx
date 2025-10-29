// pages/download.tsx
import { useEffect, useState } from "react";
import withAuth from "../components/withAuth";

function DownloadQuestionnaires() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("email");
      setUserEmail(email);
    }
  }, []);

  // Access control: Only admin can see download
  if (userEmail !== "tiruworkkassa@gmail.com") {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "80px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1 style={{ color: "#d9534f" }}>Access Denied</h1>
        <p>You do not have permission to download questionnaire data.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "80px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>📊 Download Questionnaire Data</h1>
      <p style={{ color: "#444", marginBottom: "30px" }}>
        Click below to download all questionnaire responses as an Excel file.
      </p>

      <a
        href="/api/downloadAll"
        style={{
          padding: "12px 24px",
          backgroundColor: "#0070f3",
          color: "white",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "16px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s ease",
          display: "inline-block",
        }}
        onMouseEnter={(e) =>
          ((e.target as HTMLAnchorElement).style.backgroundColor = "#0059c1")
        }
        onMouseLeave={(e) =>
          ((e.target as HTMLAnchorElement).style.backgroundColor = "#0070f3")
        }
      >
        ⬇️ Download Excel
      </a>
    </div>
  );
}

export default withAuth(DownloadQuestionnaires);
