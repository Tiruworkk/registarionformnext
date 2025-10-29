// /pages/api/submitQuestionnaire.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, answers } = req.body;

    // Basic validation
    if (!email) {
      return res.status(400).json({ message: "Email is missing. Please log in first." });
    }
    if (!answers) {
      return res.status(400).json({ message: "Answers are missing." });
    }

    // Ensure at least one checkbox selected
    if (!answers.awareness_content || answers.awareness_content.length === 0) {
      return res.status(400).json({ message: "Please select at least one awareness content." });
    }

    const client = await clientPromise;
    const db = client.db("registration_db");

    // Insert into questionnaires collection
    await db.collection("questionnaires").insertOne({
      email,
      answers,
      createdAt: new Date(),
    });

    res.status(200).json({ message: "Questionnaire submitted successfully!" });
  } catch (err) {
    console.error("Questionnaire submission error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
