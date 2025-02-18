"use client"
import "../components/styles/page.css"

import Student_display from '../components/creativitiy/student_display'
import Interview_display from '@/components/creativitiy/interview_display';

import { useState } from 'react'

export default function Home() {
  const [usn, setUSN] = useState("");

  return (
    <div className='pl-5 pr-5 pt-5 flex flex-col gap-5'>
      <header className='header'>
        <h1>Interview Index</h1>
        <nav className='nav'>
          <ul className='nav-links'>
            <li className='links'>Student Details</li>
            <li className='links'>Company Entry</li>
            <li className='links'>Student Entry</li>
          </ul>
        </nav>
      </header>
      
      <input onChange={(e) => setUSN(e.target.value)} placeholder='Example: 1NH22AI185' className="usn-input"></input>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center items-center">
        <div className="w-full md:w-[350px] h-[50vh] md:h-[80vh] rounded-lg" style={{ backgroundColor: 'var(--primary)'}}>
          <Student_display usn={ usn }/>
        </div>

        <div className="flex flex-col w-full md:w-[650px] h-auto md:h-[80vh] gap-6 md:gap-10 p-5 border-4 rounded-lg" style={{ borderColor: 'var(--primary)' }}>
          <Interview_display usn={ usn }/>
        </div>
      </div>
    </div>
  );
}
