import { useState, FormEvent } from "react";

interface QuestionnaireData {
  awareness_content: string[];
  experience: string;
  breach_experience: string;
  biggest_threat: string;
  reported_incident: string;
  mfa_used: string;
  personal_device_access: string;
  email_reaction: string;
  verify_financial_request: string;
  review_frequency: string;
}

export default function Questionnaire() {
  const [form, setForm] = useState<QuestionnaireData>({
    awareness_content: [],
    experience: "",
    breach_experience: "",
    biggest_threat: "",
    reported_incident: "",
    mfa_used: "",
    personal_device_access: "",
    email_reaction: "",
    verify_financial_request: "",
    review_frequency: "Never",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      const checked = e.target.checked;
      setForm({
        ...form,
        awareness_content: checked
          ? [...form.awareness_content, value]
          : form.awareness_content.filter((v) => v !== value),
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userId = 1; // TODO: replace with actual logged-in user ID

    const res = await fetch("/api/submitQuestionnaire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, user_id: userId }),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div
      style={{
        backgroundColor: "#603C1C", // 
        minHeight: "100vh",
        padding: "40px 0",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: "20px",
          backgroundColor: "#F0B923", 
          borderRadius: "10px",
          borderTop: "5px solid #F0B923",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Cybersecurity Questionnaire
        </h2>

        {/* 1. Awareness Content */}
        <div>
          <label>
            <strong>
              1. What kind of cybersecurity awareness content would be most
              useful for you?
            </strong>
          </label>
          <div style={{ marginLeft: "20px" }}>
            {["Videos", "Tips", "Simulations", "Workshops", "Other"].map(
              (opt) => (
                <label key={opt} style={{ display: "block", margin: "4px 0" }}>
                  <input
                    type="checkbox"
                    value={opt}
                    checked={form.awareness_content.includes(opt)}
                    onChange={handleChange}
                    required
                  />{" "}
                  {opt}
                </label>
              )
            )}
          </div>
        </div>

        {/* 2. Experience */}
        <div>
          <label>
            <strong>
              2. What was your experience regarding cybersecurity in your
              previous roles?
            </strong>
          </label>
          <textarea
            name="experience"
            value={form.experience}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "6px 0" }}
            placeholder="your experience "
           required   />
        </div>

        {/* 3. Breach experience */}
        <div>
          <label>
            <strong>
              3. Have you ever faced or witnessed any cybersecurity breach,
              attack, or data loss in your department or company?
            </strong>
          </label>
          <textarea
            name="breach_experience"
            value={form.breach_experience}
            onChange={handleChange}
                required
            style={{ width: "100%", padding: "8px", margin: "6px 0" }}
          />
        </div>

        {/* 4. Biggest threat */}
        <div>
          <label>
            <strong>
              4. In your opinion, what is the biggest cybersecurity threat to
              our bank today?
            </strong>
          </label>
          <input
            type="text"
            name="biggest_threat"
            value={form.biggest_threat}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", margin: "6px 0" }}
          />
        </div>

        {/* 5. Reported incident */}
        <div>
          <label>
            <strong>
              5. Have you ever reported a cybersecurity incident or suspicious
              email?
            </strong>
          </label>
          <select
            name="reported_incident"
            value={form.reported_incident}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "6px 0" }}
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* 6. MFA usage */}
        <div>
          <label>
            <strong>
              6. Do you use multi-factor authentication (MFA) for your business
              accounts and emails?
            </strong>
          </label>
          <select
            name="mfa_used"
            value={form.mfa_used}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "6px 0" }}
             required >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* 7. Personal device access */}
        <div>
          <label>
            <strong>
              7. Do you access corporate email or data from personal devices
              (phones, laptops, tablets)?
            </strong>
          </label>
          <select
            name="personal_device_access"
            value={form.personal_device_access}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "6px 0" }}
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* 8. Email reaction */}
        <div>
          <label>
            <strong>
              8. When you receive an unexpected email with an attachment or
              link, what’s your first reaction? Who would you contact first?
            </strong>
          </label>
          <textarea
            name="email_reaction"
            value={form.email_reaction}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "6px 0" }}
            required
          />
        </div>

        {/* 9. Verify financial request */}
        <div>
          <label>
            <strong>
              9. How do you usually verify the authenticity of urgent financial
              requests received by email or phone?
            </strong>
          </label>
          <textarea
            name="verify_financial_request"
            value={form.verify_financial_request}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "6px 0" }}
            required
          />
        </div>

        {/* 10. Review frequency */}
        <div>
          <label>
            <strong>
              10. How often do you review cybersecurity awareness flyer?
            </strong>
          </label>
          <select
            name="review_frequency"
            value={form.review_frequency}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "6px 0" }}
                required
          >
            <option value="Never">Never</option>
            <option value="Once a year">Once a year</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#8A4D1F",
            color: "#fff",
            marginTop: "20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
