"use client"

import { get_student_details } from '../server/student_retrieval'
import { useEffect, useState} from 'react'

export default function Student_display() {

  const [students, setStudents] = useState<any[]>([]);
  const [usn, setUSN] = useState("");
  const [name, setName] = useState("");
  const [backlogs, setBacklog] = useState("");

  const get_details = async () => {
    const data = await get_student_details(usn);
    if (data) setStudents(data);
  };

  useEffect(() => {
    if (students.length > 0) {
      setName(students[0].Name);
      setBacklog(students[0].Backlogs);  
      console.log(students)
    }
  }, [students])


  return (
    <div>
      <div className="student-info-container">
        <p>{name}</p>
        <p>{backlogs}</p>
      </div>
      <input type="text" onChange={(e) => setUSN(e.target.value)} />
      <button onClick={get_details}>Load Student</button>
    </div>
  );
}
