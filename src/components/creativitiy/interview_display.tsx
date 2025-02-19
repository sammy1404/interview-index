"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Check, Cross, Arrow } from "../../../public/svg/components";
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
              .includes(companyName.toLowerCase())
          )
          .map((student, index) => (
            <div key={index} className="company-container">
              <div className="main-info">
                <h2 className="text-xl">{student.company_name}</h2>
                <p className="round">
                  Eligibility: {student.eligibility ? <Check /> : <Cross />}
                </p>
                <p className="round">Opt-In: {student.applied ? <Check /> : <Cross />}</p>
                <p className="round">Short Listed: {student.shortlisted ? <Check /> : <Cross />}</p>
                <p className="round">Participated: {student.attended ? <Check /> : <Cross />}</p>
              </div>
              <>
              {student.eligibility ? (
                <div className="interview_rounds">
                <>
                  {student.resume_screening === true ? (
                    <p className="round">
                      Resume Screening <Arrow />
                    </p>
                  ) : student.resume_screening === false ? (
                    <p className="round">
                      Resume Screening <Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.aptitude === true ? (
                    <p className="round">
                      Aptitude <Arrow />
                    </p>
                  ) : student.aptitude === false ? (
                    <p className="round">
                      Aptitude <Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.gd === true ? (
                    <p className="round">
                      GD <Arrow />
                    </p>
                  ) : student.gd === false ? (
                    <p className="round">
                      GD <Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.technical_test === true ? (
                    <p className="round">
                      Technical Test <Arrow />
                    </p>
                  ) : student.technical_test === false ? (
                    <p className="round">
                      Technical Test <Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.technical_interview_1 === true ? (
                    <p className="round">
                      Technical Interview: 1 <Arrow />
                    </p>
                  ) : student.technical_interview_1 === false ? (
                    <p className="round">
                      Technical Interview: 1 <Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.technical_interview_2 === true ? (
                    <p className="round">
                      Technical Interview: 2 <Arrow />
                    </p>
                  ) : student.technical_interview_2 === false ? (
                    <p className="round">
                      Technical Interview: 2 <Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.assignment === true ? (
                    <p className="round">
                      Assignment <Arrow />
                    </p>
                  ) : student.assignment === false ? (
                    <p className="round">
                      Assignment <Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.managerial_round === true ? (
                    <p className="round">
                      Managerial Round <Arrow />
                    </p>
                  ) : student.managerial_round === false ? (
                    <p className="round">
                      Managerial Round <Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.hr_round === true ? (
                    <p className="round">
                      HR Round <Arrow />
                    </p>
                  ) : student.hr_round === false ? (
                    <p className="round">
                      HR Round <Cross />
                    </p>
                  ) : null}
                </>
              </div>
              ) : <h1 className="self-center  ">NOT ELIGIBLE</h1>}
              </>
              
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
