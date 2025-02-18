"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { get_interview_stats } from '../server/interview_retrieval'
import { useState } from 'react'

export default function Interview_display() {

  const [students, setStudents] = useState<any[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [usn, setUSN] = useState("");

  const get_details = async () => {
    const data = await get_interview_stats(usn);
    if (data) setStudents(data);
  };

  const filterdCompanies = students.filter((student) => {
    student.toLowerCase().includes(companyName.toLowerCase())
  })

  return (
    <div>
      <div className="interview-stats">
        {students.map((student, index) => (
          <div key={index} className='company-container'>
            <div className='main-info'>
              <h3>{student.company_name}</h3>
              <p>Eligibility: {student.eligibility}</p>
              <p>Opt-In: {student.applied}</p>
              <p>Participated: {student.participated}</p>
            </div>
          </div>
        ))}
        <input onChange={(e) => setCompanyName(e.target.value)} placeholder='Example: Google'></input>
      </div>
    </div>
  );
}
