// pages/api/downloadAll.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("registration_db");
    const users = await db.collection("users").find({}).toArray();

    if (!users.length) {
      return res.status(404).json({ error: "No users found." });
    }


    const sanitized = users.map(({ password, _id, ...rest }) => rest);

    const jsonData = JSON.stringify(sanitized, null, 2);


    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=all_users_report.json"
    );


    res.status(200).send(jsonData);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch users from database." });
  }
}
