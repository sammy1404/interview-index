"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { get_student_details } from "../server/student_retrieval";
import { useEffect, useState } from 'react'

type Props = {
  usn: string;
}

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
    <div>
      <div className="student-info-container">
        <p>{students[0]?.name}</p>
        <p>{students[0]?.usn}</p>
      </div>
    </div>
  );
}
