import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, job_title, email, password, retypePassword } = req.body;

  // Front-end must send retypePassword only for validation, backend won't store it
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== retypePassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("registration_db");

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Insert user WITHOUT storing retypePassword
    await db.collection("users").insertOne({ name, job_title, email, password });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Database connection failed" });
  }
}
