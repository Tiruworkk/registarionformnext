// models/UserData.ts
import clientPromise from "../lib/mongodb";

export interface UserData {
  name: string;
  job_title: string;
  email: string;
  password?: string; // optional, plain text or hashed
  questionnaire?: { [key: string]: string | string[] };
  createdAt?: Date;
}

// Save registration + optional questionnaire
export async function saveUserData(data: UserData) {
  const client = await clientPromise;
  const db = client.db("registration_db");
  const collection = db.collection("users");

  const userData = {
    ...data,
    email: data.email.trim().toLowerCase(),
    createdAt: data.createdAt || new Date(),
  };

  await collection.insertOne(userData);
}

// Find user by email (case-insensitive)
export async function findUserByEmail(email: string) {
  const client = await clientPromise;
  const db = client.db("registration_db");
  const collection = db.collection("users");

  return await collection.findOne({ email: email.trim().toLowerCase() });
}

// Update user's questionnaire
export async function updateUserQuestionnaire(email: string, questionnaire: UserData["questionnaire"]) {
  const client = await clientPromise;
  const db = client.db("registration_db");
  const collection = db.collection("users");

  await collection.updateOne(
    { email: email.trim().toLowerCase() },
    { $set: { questionnaire } }
  );
}
