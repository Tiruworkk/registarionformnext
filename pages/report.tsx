// pages/report.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAuth from "../components/withAuth";

interface ReportItem {
  email: string;
  answers: Record<string, any>;
}

function Report() {
  const router = useRouter();
  const [data, setData] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("email");
      setUserEmail(email);
    }

    const fetchData = async () => {
      try {
        const res = await fetch("/api/getReports");
        if (!res.ok) throw new Error("Failed to fetch reports");
        const result: ReportItem[] = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
    );

  // ✅ Correct download + redirect handler
  const handleDownload = async () => {
    if (userEmail !== "maru.dagne34@gmail.com") return;

    try {
      // Fetch the Excel file as a blob
      const res = await fetch(`/api/downloadAll?email=${encodeURIComponent(userEmail)}`);
      if (!res.ok) throw new Error("Failed to download");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // Create temporary link to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = "users_data.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Redirect after download
      router.push("/thank-you");
    } catch (err) {
      console.error(err);
      alert("Failed to download report. Make sure you are the admin.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "15px",
          padding: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          borderTop: "5px solid #F0B923",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#603C1C" }}>
          🧾 Cybersecurity Reports
        </h1>

        {userEmail === "maru.dagne34@gmail.com" ? (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <button
              onClick={handleDownload}
              style={{
                padding: "12px 24px",
                backgroundColor: "#0070f3",
                color: "white",
                borderRadius: "6px",
                border: "none",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor = "#0059c1")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor = "#0070f3")
              }
            >
              Download Report
            </button>
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#555", fontSize: "14px" }}>
            Logged in as <strong>{userEmail}</strong>
          </p>
        )}

        {/* Reports Table */}
        {data.length === 0 ? (
          <p>All reports found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f8f8" }}>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Email</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Submitted Answers</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.email}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                      {JSON.stringify(item.answers, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default withAuth(Report);
