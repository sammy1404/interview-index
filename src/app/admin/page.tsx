"use client";

import { Poppins } from "next/font/google";
import Student_display from "@/components/creativitiy/student_display";
import Interview_display from "@/components/creativitiy/interview_display";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import "../../components/styles/page.css"; // Ensure this exists
import "../../app/globals.css"; // Ensure this exists

// Load Poppins via next/font/google
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function Home() {
  const [usn, setUSN] = useState("");

  return (
    <div
      className={`pl-5 pr-5 pt-5 flex flex-col gap-5 ${poppins.variable}`} // Add the font variable
      style={{ backgroundColor: "hsl(var(--background))" }}
    >
      <header className="header">
        <h1 style={{ color: "hsl(var(--foreground))" }}>Interview Index</h1>
        <nav className="nav">
          <ul className="nav-links">
            <li className="links" style={{ color: "hsl(var(--foreground))" }}>
              Student Details
            </li>
            <li className="links" style={{ color: "hsl(var(--foreground))" }}>
              Company Entry
            </li>
            <li className="links" style={{ color: "hsl(var(--foreground))" }}>
              Student Entry
            </li>
            <UserButton />
          </ul>
        </nav>
      </header>

      <input
        onChange={(e) => setUSN(e.target.value)}
        placeholder="Example: 1NH22AI185"
        className="usn-input"
      />

      <div className="display-container">
        <div className="student-display-container">
          <Student_display usn={usn} />
        </div>

        <div className="interview-display-container">
          <Interview_display usn={usn} />
        </div>
      </div>
    </div>
  );
}
