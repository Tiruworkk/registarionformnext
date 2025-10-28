import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const email = req.query.email as string;

  if (!email) {
    return res.status(400).json({ message: "Missing email" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("registration_db");
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Example: return all data for this user
    const reportData = {
      name: user.name,
      job_title: user.job_title,
      email: user.email,
      createdAt: user.createdAt,
    };

    res.status(200).json(reportData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
