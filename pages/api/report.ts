import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  email?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password }: LoginRequest = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("registration_db");

    // Use lowercase for comparison
    const user = await db
      .collection("users")
      .findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Password check only (email already matched in DB query)
    if (user.password !== password) {
      return res.status(401).json({ message: "Email or password incorrect" });
    }

    // ✅ Return the email for frontend
    return res.status(200).json({ message: "Login successful", email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
