"use client";

import { Poppins } from "next/font/google";
import Student_display from "@/components/creativitiy/student_display";
import Interview_display from "@/components/creativitiy/interview_display";
import Chatbot from "@/components/creativitiy/chatbot";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"
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

// Define the Filter type
type Filter = {
  eligibility: string | null;
  applied: string | null;
  shortlisted: string | null;
  attended: string | null;
};

export default function Home() {
  const [usn, setUSN] = useState("");
  const router = useRouter();  // Initialize the router
  const [companyName, setCompanyName] = useState("");

  // Initialize filters with the correct type
  const filters_obj: Filter = {
    eligibility: null,
    applied: null,
    shortlisted: null,
    attended: null,
  };
  const [filters, setFilter] = useState<Filter>(filters_obj); // Specify the type for useState

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
        const input = radio as HTMLInputElement; // Cast to HTMLInputElement
        input.checked = false; // Now you can access the checked property
    });
    setFilter(filters_obj);
  };

  return (
    <div
      className={`flex flex-col gap-5 ${poppins.variable}`} // Add the font variable
      style={{ backgroundColor: "var(--background)" }}
    >
      <header className="header">
        <h1>DriveMetrix</h1>
        <nav className="nav">
          <ul className="nav-links">
            <li className="links">
              <input
                onChange={(e) => setUSN(e.target.value)}
                placeholder="Example: 1NH22AI185"
                className="usn-input"
              />
            </li>
            <li className="links" style={{ color: "var(--foreground)" }}>
            <Button 
                onClick={() => router.push("/admin/upload")}  
                className="uploadLink"
              >
                Upload Data
              </Button>
            </li>
            <li className="links" style={{ color: "var(--foreground)"}}><UserButton /></li>
          </ul>
        </nav>
      </header>


      <div className="display-container">
        <div className="student-display-container">
          <Student_display usn={usn} />
          <div className="filter-container">
            <input
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Example: Microsoft"
              className="company-input"
            ></input>

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
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        </div>

        <div className="interview-display-container">
          <Interview_display usn={usn} filters={filters} companyName={companyName}/>
        </div>
      </div>
      <Chatbot usn={usn}/>
    </div>
  );
}
