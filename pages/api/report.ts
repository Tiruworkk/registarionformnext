// pages/api/report.ts

import type { NextApiRequest, NextApiResponse } from "next";

// Define the structure of the response data
interface ReportResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Main API handler
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReportResponse>
) {
  // Handle POST requests (for submitting a report)
  if (req.method === "POST") {
    const reportData = req.body;

    // Example: validate and process data
    if (!reportData || !reportData.user || !reportData.issue) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (user, issue).",
      });
    }

    // Normally, you might save to a database here
    console.log("Report received:", reportData);

    return res.status(200).json({
      success: true,
      message: "Report submitted successfully.",
      data: reportData,
    });
  }

  // Handle GET requests (for fetching sample report info)
  if (req.method === "GET") {
    return res.status(200).json({
      success: true,
      message: "Report API is working fine.",
      data: {
        example: {
          user: "full name",
          issue: "Phishing email detected",
          timestamp: new Date().toISOString(),
        },
      },
    });
  }

  // Handle unsupported methods
  return res.status(405).json({
    success: false,
    message: "Method not allowed. Use GET or POST.",
  });
}
