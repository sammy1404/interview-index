"use client"

import { useParams } from "next/navigation";
import Rounds from "./Rounds";
import StudentAnalysis from "./StudentAnalysis";

const RoundsPage = () => {
  const { company } = useParams<{ company: string }>(); // Specify the type for useParams

  // Ensure company is a string, providing a fallback if necessary
  const companyName = Array.isArray(company) ? company[0] : company || "Unknown"; // Fallback to a default value

  return (
    <div className="flex flex-col h-[100vh] w-[100vw] items-center gap-5">
      <h1 className="text-3xl mt-5">Rounds for {companyName}</h1>
      <Rounds company={companyName} />
      <StudentAnalysis />
    </div>
  );
};

export default RoundsPage;
