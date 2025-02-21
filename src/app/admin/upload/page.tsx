"use client";

import { useState } from "react";

import { createClient } from '@supabase/supabase-js';
import Eligibility from "./Eligible-table";

const url: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon_key: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const supabase = createClient(url, anon_key);


const HomePage = () => {
  const [company, setCompany] = useState<string>("");

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center my-3">Upload Data</h1>
      <form onSubmit={(e) => { e.preventDefault(); }}>
        <input className="bg-muted placeholder:text-input px-3 py-1 rounded-md text-center" type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Enter company name" />
      </form>
      <div>
        <Eligibility company={company} />
      </div>
      
    </div>
  );
};

export default HomePage;
