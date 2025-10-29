// models/Report.ts
import clientPromise from "../lib/mongodb";

export async function findReportByEmail(email: string) {
  const client = await clientPromise;
  const db = client.db("registration_db");

  const user = await db.collection("users").findOne({ email: email.trim().toLowerCase() });
  if (!user) return null;

  const questionnaire = await db
    .collection("questionnaires")
    .findOne({ email: email.trim().toLowerCase() });

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    job_title: user.job_title,
    answers: questionnaire?.answers || {},
  };
}
