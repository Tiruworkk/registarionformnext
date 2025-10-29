import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("email", form.email.trim().toLowerCase());
        alert("Login successful!");

        if (form.email.trim().toLowerCase() === "tiruworkkassa@gmail.com") {
          router.push("/report"); // Admin
        } else {
          router.push("/questionnaire"); // Normal user
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <>
      {/* Global CSS to prevent scrolling and fix background */}
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
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: "url('/images/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: 400,
            width: "100%",
            padding: "40px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "15px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            borderTop: "5px solid #F0B923",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "25px" }}>
            <Image src="/images/logo.png" alt="Bank Logo" width={120} height={120} />
          </div>

          <h2
            style={{
              textAlign: "center",
              marginBottom: "30px",
              color: "#603C1C",
              fontWeight: 700,
              fontSize: "1.8rem",
            }}
          >
            Login
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "2px solid #F0B923",
              }}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "25px",
                borderRadius: "8px",
                border: "2px solid #F0B923",
              }}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#F0B923",
                color: "#603C1C",
                fontWeight: 700,
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "0.9rem",
            }}
          >
            Don’t have an account?{" "}
            <a
              href="/register"
              style={{
                color: "#F0B923",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
