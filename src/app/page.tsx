"use client"

import { useEffect, useState } from "react";
import get_student_details from "../components/server/student_retrieval.tsx";

export default function Home() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      const data = await get_student_details();
      if (data) setStudents(data);
      setLoading(false);
    }

    fetchStudents();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Student Details</h1>
      <ul>
        {students.map((student, index) => (
          <li key={index}>{student.Name} - {student.USN}</li>
        ))}
      </ul>
    </div>
  );
}
