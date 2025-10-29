// pages/thank-you.tsx
import { useRouter } from "next/router";
import withAuth from "../components/withAuth";

function ThankYou() {
  const router = useRouter();

  return (
    <>
      {/* Prevent scrolling */}
      <style>{`
        html, body {
          height: 100%;
          margin: 0;
          overflow: hidden; /* prevents scrolling */
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: "url('/images/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: "20px",
        }}
      >
        <div
          style={{
            padding: "40px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "15px",
            textAlign: "center",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            borderTop: "5px solid #F0B923",
          }}
        >
          <h1 style={{ color: "#603C1C", marginBottom: "20px" }}>Thank You!</h1>
          <p>Your responses have successfully Done.</p>
          <button
            onClick={() => router.push("/login")}
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              backgroundColor: "#F0B923",
              color: "#603C1C",
              fontWeight: 700,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    </>
  );
}

export default withAuth(ThankYou);
