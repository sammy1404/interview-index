"use client";

import { Poppins } from "next/font/google";
import Student_display from "@/components/creativitiy/student_display";
import Interview_display from "@/components/creativitiy/interview_display";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";  // Import useRouter

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
  const router = useRouter();  // Initialize the router

  const filters = {
    eligibility: null,
    optin: null,
    shortlisted: null,
    participated: null,
  }

  function updateFilter(name: string, value: string) {
    filters.name = value;
  }


  return (
    <div
      className={`pl-5 pr-5 pt-5 flex flex-col gap-5 ${poppins.variable}`} // Add the font variable
      style={{ backgroundColor: "hsl(var(--background))" }}
    >
      <header className="header">
        <h1 className="text-foreground" style={{ color: "hsl(var(--foreground))" }}>Drive Metrics</h1>
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
          <div className="filter-container">

            <div className="filter-box">
              <label htmlFor="eligibility-no">Eligibility:</label>
              <input 
                type="checkbox" 
                id="eligibility-yes" 
                value="eligibility true" 
                onChange={(e) => updateFilter({name: e.target.name, value: e.target.value})}/>Yes
              <input 
                type="checkbox" 
                id="eligibility-no" 
                value="eligibility false" 
                onChange={(e) => updateFilter({name: e.target.name, value: e.target.value})}/>No
            </div>

            <div className="filter-box">
              <label htmlFor="Optin-no">Opt-In:</label>
              <input 
                type="checkbox" 
                id="optin-yes" 
                value="optin yes" 
                onChange={(e) => updateFilter({name: e.target.name, value: e.target.value})}/>Yes
              <input 
                type="checkbox" 
                id="optin-no" 
                value="optin no" 
                onChange={(e) => updateFilter({name: e.target.name, value: e.target.value})}/>No
            </div>

            <div className="filter-box">
              <label htmlFor="shortlisted-no">Short Listed:</label>
              <input 
                type="checkbox" 
                id="shortlisted-yes" 
                value="shortlisted yes" 
                onChange={(e) => updateFilter({name: e.target.name, value: e.target.value})}/>Yes
              <input 
                type="checkbox" 
                id="shortlisted-no" 
                value="shortlisted no" 
                onChange={(e) => updateFilter({name: e.target.name, value: e.target.value})}/>No
            </div>

            <div className="filter-box">
              <label htmlFor="Optin-no">Participated:</label>
              <input 
                type="checkbox" 
                id="participated-yes" 
                value="participated yes" 
                onChange={(e) => updateFilter({name: e.target.name, value: e.target.value})}/>Yes
              <input 
                type="checkbox" 
                id="participated-no" 
                value="participated no" 
                onChange={(e) => updateFilter({name: e.target.name, value: e.target.value})}/>No
            </div>
          </div>
        </div>

        <div className="interview-display-container">
          <Interview_display usn={usn} filters={filters}/>
        </div>
      </div>
      <div className="flex w-full justify-center align-middle">
        <button 
            onClick={() => router.push("/admin/upload")}  
            className="bg-accent text-white px-4 py-2 rounded-md hover:bg-muted-foreground transition mb-10"
          >
            Upload Data
          </button>
      </div>

    </div>
  );
}
