"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { get_student_details } from '../server/student_retrieval'
import { useState } from 'react'

export default function Student_display() {

  const [students, setStudents] = useState<any[]>([]);
  const [usn, setUSN] = useState("");
  
  const get_details = async () => {
    const data = await get_student_details(usn);
    if (data) setStudents(data);
  };



  return (
    <div>
      <div className="student-info-container">
        <p>{students[0]?.Name}</p>
        <p>{students[0]?.USN}</p>
      </div>
      <input type="text" onChange={(e) => setUSN(e.target.value)} />
      <button onClick={get_details}>Load Student</button>
    </div>
  );
}
