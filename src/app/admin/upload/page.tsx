"use client";

import { useState } from "react";

import Eligibility from "./Eligible-table";

const HomePage = () => {
  const [company, setCompany] = useState<string>("");

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center my-3">Upload Data</h1>
      <form onSubmit={(e) => { e.preventDefault(); }}>
        <input className="bg-muted placeholder:text-input px-3 py-1 rounded-md text-center" type="text" value={company} onChange={(e) => setCompany(e.target.value.toLowerCase())} placeholder="Enter company name" />
      </form>
      <div className="flex mt-5 gap-6 w-[100vw] justify-center">
        <Eligibility company={company} />
      </div>
      
    </div>
  );
};

export default HomePage;
