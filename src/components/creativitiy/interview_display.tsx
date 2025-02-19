"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import "../styles/interview_display.css";
import { get_interview_stats } from "../server/interview_retrieval";
import { useEffect, useState } from "react";

type Props = {
  usn: string;
};

export default function Interview_display({ usn }: Props) {
  const [students, setStudents] = useState<any[]>([]);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const get_details = async () => {
      const data = await get_interview_stats(usn);
      if (data) setStudents(data);
    };
    get_details();
  }, [usn]);

  return (
    <div>
      <div className="interview-stats">
        {students
          .filter((student: any): any =>
            student.company_name
              .toLowerCase()
              .includes(companyName.toLowerCase()),
          )
          .map((student, index) => (
            <div key={index} className="company-container">
              <div className="main-info">
                <h2 className="text-xl">{student.company_name}</h2>
                <p>Eligibility: {student.eligibility ? "✅" : "❌"}</p>
                <p>Opt-In: {student.applied ? "✅" : "❌"}</p>
                <p>Participated: {student.participated ? "✅" : "❌"}</p>
              </div>
            </div>
          ))}
      </div>
      <input
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Example: Google"
      ></input>
    </div>
  );
}
