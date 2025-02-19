"use client";
import "../../components/styles/page.css";

import Student_display from "@/components/creativitiy/student_display";
import Interview_display from "@/components/creativitiy/interview_display";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";  // Import useRouter

import { useState } from "react";

export default function Home() {
  const [usn, setUSN] = useState("");
  const router = useRouter();  // Initialize the router

  return (
    <div className="pl-5 pr-5 pt-5 flex flex-col gap-5">
      <header className="header">
        <h1>Interview Index</h1>
        <nav className="nav">
          <ul className="nav-links">
            <li className="links">Student Details</li>
            <li className="links">Company Entry</li>
            <li className="links">Student Entry</li>
            <UserButton />
          </ul>
        </nav>
      </header>

      <input
        onChange={(e) => setUSN(e.target.value)}
        placeholder="Example: 1NH22AI185"
        className="usn-input"
      ></input>

      <div className="display-container">
        <div className="student-display-container">
          <Student_display usn={usn} />
        </div>

        <div className="interview-display-container">
          <Interview_display usn={usn} />
        </div>
      </div>
      <button 
          onClick={() => router.push("/admin/upload")}  
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Upload Data
        </button>
      
    </div>
  );
}
