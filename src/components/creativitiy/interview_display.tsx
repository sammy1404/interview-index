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
              .includes(companyName.toLowerCase()),
          )
          .map((student, index) => (
            <div key={index} className="company-container">
              <div className="main-info">
                <h2 className="text-xl">{student.company_name}</h2>
                <p>
                  Eligibility: {student.eligibility ? <Check /> : <Cross />}
                </p>
                <p>Opt-In: {student.applied ? <Check /> : <Cross />}</p>
                <p>Participated: {student.attended ? <Check /> : <Cross />}</p>
              </div>
              <div className="interview_rounds">
                <p className="round">
                  {student.resume_screening === true ? (
                    <>
                      {" "}
                      Resume Screening <Arrow />{" "}
                    </>
                  ) : student.resume_screening === false ? (
                    <>
                      {" "}
                      Resume Screening <Cross />{" "}
                    </>
                  ) : null}
                </p>
                <p className="round">
                  {student.aptitude === true ? (
                    <>
                      {" "}
                      Aptitude <Arrow />{" "}
                    </>
                  ) : student.aptitude === false ? (
                    <>
                      {" "}
                      Aptitude <Cross />{" "}
                    </>
                  ) : null}
                </p>
                <p className="round">
                  {student.gd === true ? (
                    <>
                      {" "}
                      GD <Arrow />{" "}
                    </>
                  ) : student.gd === false ? (
                    <>
                      {" "}
                      GD <Cross />{" "}
                    </>
                  ) : null}
                </p>
                <p className="round">
                  {student.technical_test === true ? (
                    <>
                      {" "}
                      Technical Test <Arrow />{" "}
                    </>
                  ) : student.technical_test === false ? (
                    <>
                      {" "}
                      Technical Test <Cross />{" "}
                    </>
                  ) : null}
                </p>
                <p className="round">
                  {student.technical_interview_1 === true ? (
                    <>
                      {" "}
                      Technical Interview: 1 <Arrow />{" "}
                    </>
                  ) : student.technical_interview_1 === false ? (
                    <>
                      {" "}
                      Technical Interview: 1 <Cross />{" "}
                    </>
                  ) : null}
                </p>
                <p className="round">
                  {student.technical_interview_2 === true ? (
                    <>
                      {" "}
                      Technical Interview: 2 <Arrow />{" "}
                    </>
                  ) : student.technical_interview_2 === false ? (
                    <>
                      {" "}
                      Technical Interview: 2 <Cross />{" "}
                    </>
                  ) : null}
                </p>
                <p className="round">
                  {student.assignment === true ? (
                    <>
                      {" "}
                      Assignment <Arrow />{" "}
                    </>
                  ) : student.assignment === false ? (
                    <>
                      {" "}
                      Assignment <Cross />{" "}
                    </>
                  ) : null}
                </p>
                <p className="round">
                  {student.managerial_round === true ? (
                    <>
                      {" "}
                      Managerial Round <Arrow />{" "}
                    </>
                  ) : student.managerial_round === false ? (
                    <>
                      {" "}
                      Managerial Round <Cross />{" "}
                    </>
                  ) : null}
                </p>
                <p className="round">
                  {student.hr_round === true ? (
                    <>
                      {" "}
                      HR Round <Arrow />{" "}
                    </>
                  ) : student.hr_round === false ? (
                    <>
                      {" "}
                      HR Round <Cross />{" "}
                    </>
                  ) : null}
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
