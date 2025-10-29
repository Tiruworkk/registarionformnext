import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("registration_db");

    const questionnaires = await db.collection("questionnaires").find({}).toArray();

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=questionnaires.json");

    res.status(200).send(JSON.stringify(questionnaires, null, 2));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch questionnaires." });
  }
}
