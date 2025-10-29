import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "Missing fields" });

  try {
    const client = await clientPromise;
    const db = client.db("registration_db");
    const users = db.collection("users");

    const existing = await users.findOne({ email: email.trim().toLowerCase() });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    await users.insertOne({ email: email.trim().toLowerCase(), password });
    res.status(200).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
