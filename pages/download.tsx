import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface ReportData {
  name: string;
  job_title: string;
  email: string;
  createdAt: string;
}

export default function Download() {
  const router = useRouter();
  const { email } = router.query;
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    if (!email) return;

    fetch(`/api/report?email=${email}`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, [email]);

  if (!data) return <p>Loading report...</p>;

  return (
    <div>
      <h1>Report</h1>
      <p>Name: {data.name}</p>
      <p>Job Title: {data.job_title}</p>
      <p>Email: {data.email}</p>
      <p>Registered At: {new Date(data.createdAt).toLocaleString()}</p>
      <a
        href={`/api/report?email=${email}`}
        download={`report_${data.name}.json`}
      >
        Download Report
      </a>
    </div>
  );
}
 
