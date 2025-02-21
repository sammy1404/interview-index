"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import "../styles/student_display.css";

import { get_student_details } from "../server/student_retrieval";
import { useEffect, useState } from "react";

type Props = {
  usn: string;
};

export default function Student_display({ usn }: Props) {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const get_details = async () => {
      const data = await get_student_details(usn);
      if (data) setStudents(data);
    };
    get_details();
  }, [usn]);

  return (
    <div className="student-info">
      <div className="student-info-container">
        <div className="student-header">
          <img src="../../../public/profile.svg" width={100} height={100} />
          <p className="text-2xl">{students[0]?.name}</p>
          <p className="text-lg">{students[0]?.usn}</p>
        </div>
        <p>
          10th: <span>{students[0]?.tenth_percentage}</span>{" "}
        </p>
        <p>
          12th: <span>{students[0]?.twelfth_percentage}</span>{" "}
        </p>
        <p>
          GPA: <span>{students[0]?.current_cgpa}</span>{" "}
        </p>
        <p>
          Backlogs: <span>{students[0]?.backlogs}</span>{" "}
        </p>
        <p>
          Department: <span>{students[0]?.department}</span>{" "}
        </p>
        <p>
          Email: <span>{students[0]?.email}</span>{" "}
        </p>
        <p>
          Phone: <span>{students[0]?.phone_number}</span>{" "}
        </p>
      </div>
    </div>
  );
}
