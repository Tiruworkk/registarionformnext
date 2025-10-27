// pages/api/getQuestionnaire.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import oracledb from 'oracledb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId) return res.status(400).json({ message: 'Missing userId' });

  let connection;

  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT,
    });

    const result = await connection.execute(
      `SELECT QUESTION_ID, ANSWER FROM QUESTIONNAIRE_ANSWERS WHERE USER_ID = :userId`,
      { userId: Number(userId) }
    );

    res.status(200).json({ answers: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  } finally {
    if (connection) await connection.close();
  }
}
