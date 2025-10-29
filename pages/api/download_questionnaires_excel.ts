import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import ExcelJS from "exceljs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("registration_db");

    // Fetch all questionnaires and users
    const questionnaires = await db.collection("questionnaires").find({}).toArray();
    const users = await db.collection("users").find({}).toArray();

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Questionnaires");

    // Define the Excel columns
    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Job Title", key: "job_title", width: 20 },
      { header: "Awareness Content", key: "awareness_content", width: 30 },
      { header: "Experience", key: "experience", width: 15 },
      { header: "Breach Experience", key: "breach_experience", width: 15 },
      { header: "Biggest Threat", key: "biggest_threat", width: 20 },
      { header: "Reported Incident", key: "reported_incident", width: 15 },
      { header: "MFA Used", key: "mfa_used", width: 15 },
      { header: "Personal Device Access", key: "personal_device_access", width: 20 },
      { header: "Email Reaction", key: "email_reaction", width: 20 },
      { header: "Verify Financial Request", key: "verify_financial_request", width: 25 },
      { header: "Review Frequency", key: "review_frequency", width: 20 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    // Combine user + questionnaire data
    questionnaires.forEach((q: any) => {
      const user = users.find((u: any) => u._id?.toString() === q.user_id?.toString());

      worksheet.addRow({
        name: user?.name || "Unknown",
        email: user?.email || "Unknown",
        job_title: user?.job_title || "",
        awareness_content: (q.answers?.awareness_content || []).join(", "),
        experience: q.answers?.experience || "",
        breach_experience: q.answers?.breach_experience || "",
        biggest_threat: q.answers?.biggest_threat || "",
        reported_incident: q.answers?.reported_incident || "",
        mfa_used: q.answers?.mfa_used || "",
        personal_device_access: q.answers?.personal_device_access || "",
        email_reaction: q.answers?.email_reaction || "",
        verify_financial_request: q.answers?.verify_financial_request || "",
        review_frequency: q.answers?.review_frequency || "",
        createdAt: q.createdAt ? new Date(q.createdAt).toLocaleString() : "",
      });
    });

    // Set headers for Excel download
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=questionnaires.xlsx");

    // Write Excel file to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("❌ Error exporting Excel:", err);
    res.status(500).json({ error: "Failed to export Excel file." });
  }
}
