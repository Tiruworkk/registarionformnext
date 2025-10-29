import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, job_title, email, password } = req.body;

    if (!name || !job_title || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const client = await clientPromise;
    const db = client.db("registration_db");

    // Check if user exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Save user in plain text (no hashing)
    await db.collection("users").insertOne({
      name,
      job_title,
      email,
      password, // <-- plain text password
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
