// pages/api/report.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { findUserByEmail } from "../../models/UserData";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email query parameter is required." });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "No data found for this email." });
    }

    // Remove password if present
    const { password, ...reportData } = user;

    const jsonData = JSON.stringify(reportData, null, 2);

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report_${email.replace(/[@.]/g, "_")}.json`
    );

    res.status(200).send(jsonData);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch data from database." });
  }
}
