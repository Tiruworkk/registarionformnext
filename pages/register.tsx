import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

interface FormData {
  name: string;
  job_title: string;
  email: string;
  password: string;
  retypePassword: string;
}

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: "",
    job_title: "",
    email: "",
    password: "",
    retypePassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (form.password !== form.retypePassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);

        // ✅ Save a flag so the questionnaire page knows this user registered
        localStorage.setItem("registered", "true");

        router.push("/questionnaire");
      } else {
        alert(data.message);
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
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: 500,
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

        <h2 style={{ textAlign: "center", color: "#603C1C" }}>
          Registration Form
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
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

          <select
            name="job_title"
            value={form.job_title}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "2px solid #F0B923",
            }}
          >
            <option value="" disabled hidden>
              Select Role
            </option>
            <option>Chief</option>
            <option>CEO</option>
            <option>CIO</option>
            <option>Deputy Chief</option>
            <option>Director</option>
            <option>Executive</option>
            <option>Division</option>
          </select>

          <input
            type="email"
            name="email"
            placeholder="test@gmail.com"
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
            placeholder="Enter your password"
            value={form.password}
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
            name="retypePassword"
            placeholder="Retype your password"
            value={form.retypePassword}
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
              fontWeight: "700",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
