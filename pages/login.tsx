import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

interface LoginForm {
  email: string;
  password: string;
}

export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
        // Save email in localStorage
        const emailFromApi = data.email?.toLowerCase() || form.email.toLowerCase();
        localStorage.setItem("email", emailFromApi);

        // Redirect based on email
        if (emailFromApi === "maru.dagne34@gmail.com") {
          router.push("/report"); // Admin goes to report page
        } else {
          router.push("/questionnaire"); // Normal users
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
        backgroundAttachment: "fixed",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: 400,
          padding: "40px",
          backgroundColor: "white",
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
              outline: "none",
              fontSize: "1rem",
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
              outline: "none",
              fontSize: "1rem",
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
              fontSize: "1.1rem",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e6aa1f")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#F0B923")}
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
          Don't have an account?{" "}
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
  );
}
