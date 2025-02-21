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

  const filters_obj: {[key: string]: string | null} = {
    eligibility: null,
    applied: null,
    shortlisted: null,
    attended: null,
  }
  const [filters, setFilter] = useState(filters_obj)

  function updateFilter(criteria: string, value: string) {
    if (criteria in filters) {
      setFilter((prevFilters) => ({
        ...prevFilters,
        [criteria]: value
      }))
    }
  }

  const clearFilters = () => {
    const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach((radio) => {
            return (radio.checked = false);
        });
    setFilter(filters_obj)
  };

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
            <li 
                onClick={() => router.push("/admin/upload")}  
                className="cursor-pointer"
              >
                Upload Data
              </li>
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
                type="radio" 
                name="eligibility"
                id="eligibility-yes" 
                value="true" 
                onChange={(e) => updateFilter(e.target.name, e.target.value)}/>Yes
              <input 
                type="radio" 
                name="eligibility"
                id="eligibility-no" 
                value="false" 
                onChange={(e) => updateFilter(e.target.name, e.target.value)}/>No
            </div>

            <div className="filter-box">
              <label htmlFor="Optin-no">Opt-In:</label>
              <input 
                type="radio" 
                name="applied"
                id="optin-yes" 
                value="true" 
                onChange={(e) => updateFilter(e.target.name, e.target.value)}/>Yes
              <input 
                type="radio" 
                name="applied"
                id="optin-no" 
                value="false" 
                onChange={(e) => updateFilter(e.target.name, e.target.value)}/>No
            </div>

            <div className="filter-box">
              <label htmlFor="shortlisted-no">Short Listed:</label>
              <input 
                type="radio" 
                name="shortlisted"
                id="shortlisted-yes" 
                value="true" 
                onChange={(e) => updateFilter(e.target.name, e.target.value)}/>Yes
              <input 
                type="radio" 
                name="shortlisted"
                id="shortlisted-no" 
                value="false" 
                onChange={(e) => updateFilter(e.target.name, e.target.value)}/>No
            </div>

            <div className="filter-box">
              <label htmlFor="Optin-no">Participated:</label>
              <input 
                type="radio" 
                name="participated"
                id="participated-yes" 
                value="true" 
                onChange={(e) => updateFilter(e.target.name, e.target.value)}/>Yes
              <input 
                type="radio" 
                name="participated"
                id="participated-no" 
                value="false" 
                onChange={(e) => updateFilter(e.target.name, e.target.value)}/>No
            </div>
            <button onClick={clearFilters}>Clear Filters</button>
          </div>
        </div>

        <div className="interview-display-container">
          <Interview_display usn={usn} filters={filters}/>
        </div>
      </div>
    </div>
  );
}
