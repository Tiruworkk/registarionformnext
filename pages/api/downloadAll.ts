// /pages/api/downloadAll.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import ExcelJS from "exceljs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("registration_db");

    // Fetch users and questionnaires
    const users = await db.collection("users").find({}).toArray();
    const questionnaires = await db.collection("questionnaires").find({}).toArray();

    // Create new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Questionnaire Data");

    // Define header row
    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Job Title", key: "job_title", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Awareness Content", key: "awareness_content", width: 40 },
      { header: "Experience", key: "experience", width: 40 },
      { header: "Breach Experience", key: "breach_experience", width: 40 },
      { header: "Biggest Threat", key: "biggest_threat", width: 30 },
      { header: "Reported Incident", key: "reported_incident", width: 20 },
      { header: "MFA Used", key: "mfa_used", width: 15 },
      { header: "Personal Device Access", key: "personal_device_access", width: 20 },
      { header: "Email Reaction", key: "email_reaction", width: 40 },
      { header: "Verify Financial Request", key: "verify_financial_request", width: 40 },
      { header: "Review Frequency", key: "review_frequency", width: 20 },
    ];

    // Add rows
    users.forEach(user => {
      const matchedQuestionnaire = questionnaires.find(q => q.email === user.email);
      const answers = matchedQuestionnaire?.answers || {};

      worksheet.addRow({
        name: user.name,
        job_title: user.job_title,
        email: user.email,
        awareness_content: answers.awareness_content?.join(", ") || "",
        experience: answers.experience || "",
        breach_experience: answers.breach_experience || "",
        biggest_threat: answers.biggest_threat || "",
        reported_incident: answers.reported_incident || "",
        mfa_used: answers.mfa_used || "",
        personal_device_access: answers.personal_device_access || "",
        email_reaction: answers.email_reaction || "",
        verify_financial_request: answers.verify_financial_request || "",
        review_frequency: answers.review_frequency || "",
      });
    });

    // Set response headers
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=questionnaire_answers.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Write workbook to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).json({ error: "Failed to generate Excel file." });
  }
}
