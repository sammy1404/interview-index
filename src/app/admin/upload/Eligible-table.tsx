"use client";

import React from 'react';
import { useState, useEffect } from "react";

import { createClient } from '@supabase/supabase-js';

const url: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon_key: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const supabase = createClient(url, anon_key);

interface EligibilityProps {
  company: string; // Ensure the prop is typed as a string
}

const Eligibility: React.FC<EligibilityProps> = ({ company }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  useEffect(() => {
    const fetchData = async () => {
      let { data: fetchedData, error } = await supabase.from("student_info").select("*");
      if (error) console.error("Error fetching data:", error);
      else setData(fetchedData || []);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  // Filter data based on search term
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.usn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Eligibility Information</h2>
      <p>Company Name: {company}</p>
      <input 
        type="text" 
        placeholder="Search by name or USN" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
      />
      <table className="border-2">
        <thead>
          <tr className="p-5">
            <th className="border-2 px-2">Eligible</th>
            <th className="border-2">Name</th>
            <th className="border-2">USN</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-2 px-5">
              <input 
                type="checkbox" 
                onChange={(e) => {
                  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                  checkboxes.forEach((checkbox) => {
                    const input = checkbox as HTMLInputElement;
                    input.checked = e.target.checked;
                  });
                }} 
              />
            </td>
            <td className="border-2 px-5" colSpan={2}>
              <button onClick={() => {
                const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach((checkbox) => {
                  const input = checkbox as HTMLInputElement;
                  input.checked = true;
                });
              }}>
                Select All
              </button>
            </td>
          </tr>
          {filteredData.map((item) => ( // Use filtered data for rendering
            <tr key={item.id} className="border-2">
              <td className="border-2 px-5"><input type="checkbox" /></td>
              <td className="border-2 px-5">{item.name}</td>
              <td className="border-2 px-5">{item.usn}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Eligibility;
