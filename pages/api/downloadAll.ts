import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import ExcelJS from "exceljs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("registration_db");

    // Fetch users
    const users = await db.collection("users").find({}).toArray();

    // Create new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users Data");

    // Define header row: name, job title, email, password
    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Job Title", key: "job_title", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Password", key: "password", width: 25 },
    ];

    // Add rows
    users.forEach(user => {
      worksheet.addRow({
        name: user.name || "",
        job_title: user.job_title || "",
        email: user.email || "",
        password: user.password || "", // include password
      });
    });

    // Set response headers for download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users_data.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).json({ error: "Failed to generate Excel file." });
  }
}
