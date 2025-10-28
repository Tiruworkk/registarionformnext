// pages/api/submitQuestionnaire.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

// Load oracledb dynamically so builds don't fail in environments without the native driver.
let oracledb: any = undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  oracledb = require("oracledb");
} catch (err) {
  // driver not available; runtime will fail if DB access is attempted
}

interface Data {
  message: string;
}
 
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const client = await clientPromise;
    const db = client.db("registration_db");
    const { user_id, ...answers } = req.body;

    await db.collection("questionnaires").insertOne({
      user_id,
      answers,
      createdAt: new Date()
    });

    return res.status(200).json({ message: "Questionnaire submitted successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
