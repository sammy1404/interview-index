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
    <div className="student-info h-2/3">
      <div className="student-info-container">
        <div className="student-header">
          <svg width="100px" height="100px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.4" d="M12.1207 12.78C12.0507 12.77 11.9607 12.77 11.8807 12.78C10.1207 12.72 8.7207 11.28 8.7207 9.50998C8.7207 7.69998 10.1807 6.22998 12.0007 6.22998C13.8107 6.22998 15.2807 7.69998 15.2807 9.50998C15.2707 11.28 13.8807 12.72 12.1207 12.78Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path opacity="0.34" d="M18.7398 19.3801C16.9598 21.0101 14.5998 22.0001 11.9998 22.0001C9.39977 22.0001 7.03977 21.0101 5.25977 19.3801C5.35977 18.4401 5.95977 17.5201 7.02977 16.8001C9.76977 14.9801 14.2498 14.9801 16.9698 16.8001C18.0398 17.5201 18.6398 18.4401 18.7398 19.3801Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
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
