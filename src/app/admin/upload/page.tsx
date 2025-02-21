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
    <div>
      <h1>Upload Data</h1>
      <form onSubmit={(e) => { e.preventDefault(); }}>
        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Enter company name" />
        <button type="submit">Submit</button>
      </form>
      <Eligibility company={company} />
    </div>
  );
};

export default HomePage;
