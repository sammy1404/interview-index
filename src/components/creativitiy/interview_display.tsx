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
      console.log(data);
      if (data) setStudents(data);
    };
    get_details();
  }, [usn]);

  return (
    <div className="interview-container">
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
                <p>Participated: {student.attended ? "✅" : "❌"}</p>
              </div>
              <div className="interview_rounds">
                <p className="round">
                  {student.resume_screening === true
                    ? "Resume Screening "
                    : student.resume_screening === false
                      ? "Resume Screening X"
                      : null}
                </p>
                <p className="round">
                  {student.aptitude === true
                    ? "aptitude ->"
                    : student.aptitude === false
                      ? "aptitude X"
                      : null}
                </p>
                <p className="round">
                  {student.gd === true
                    ? "GD ->"
                    : student.gd === false
                      ? "GD X"
                      : null}
                </p>
                <p className="round">
                  {student.technical_test === true
                    ? "technical_test ->"
                    : student.technical_test === false
                      ? "technical_test X"
                      : null}
                </p>
                <p className="round">
                  {student.technical_interview_1 === true
                    ? "Technical Interview: 1 ->"
                    : student.technical_interview_1 === false
                      ? "Technical Interview: 1 X"
                      : null}
                </p>
                <p className="round">
                  {student.technical_interview_2 === true
                    ? "Technical Interview: 2 ->"
                    : student.technical_interview_2 === false
                      ? "Technical Interview: 2 X"
                      : null}
                </p>
                <p className="round">
                  {student.assignment === true
                    ? "Assignment ->"
                    : student.assignment === false
                      ? "Assignment X"
                      : null}
                </p>
                <p className="round">
                  {student.managerial_round === true
                    ? "Managerial_round ->"
                    : student.managerial_round === false
                      ? "Managerial_round X"
                      : null}
                </p>
                <p className="round">
                  {student.hr_round === true
                    ? "HR Round ->"
                    : student.hr_round === false
                      ? "HR Round X"
                      : null}
                </p>
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
