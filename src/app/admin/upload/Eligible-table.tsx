"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const url: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon_key: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const supabase = createClient(url, anon_key);

interface EligibilityProps {
  company: string;
}

const Eligibility: React.FC<EligibilityProps> = ({ company }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedItems, setCheckedItems] = useState<{ [usn: string]: boolean }>({});
  const [selectAll, setSelectAll] = useState(false);
  const drive = company;

  useEffect(() => {
    const fetchData = async () => {
      let { data: fetchedData, error } = await supabase.from("student_info").select("*");
      if (error) console.error("Error fetching data:", error);
      else {
        setData(fetchedData || []);
        const initialCheckedState = fetchedData?.reduce((acc, item) => {
          acc[item.usn] = false; // Track state using `usn`
          return acc;
        }, {} as { [usn: string]: boolean });
        setCheckedItems(initialCheckedState);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.usn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (usn: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [usn]: !prev[usn],
    }));
  };

  const handleSelectAll = () => {
    const newCheckedState = filteredData.reduce((acc, item) => {
      acc[item.usn] = !selectAll; // Use `usn`
      return acc;
    }, {} as { [usn: string]: boolean });

    setCheckedItems((prev) => ({ ...prev, ...newCheckedState }));
    setSelectAll(!selectAll);
  };
  
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const selectedStudentUsns = Object.keys(checkedItems).filter((usn) => checkedItems[usn]);
  
    if (selectedStudentUsns.length === 0) {
      console.warn("No students selected for insertion.");
      return;
    }
  
    // Fetch all existing USNs in student_info
    const { data: existingStudents, error: fetchError } = await supabase
      .from("student_info")
      .select("usn")
      .in("usn", selectedStudentUsns);
  
    if (fetchError) {
      console.error("Error fetching student_info:", fetchError);
      return;
    }
  
    // Extract only valid USNs
    const validUsns = existingStudents?.map((student) => student.usn) || [];
    const validStudentsData = selectedStudentUsns
      .filter((usn) => validUsns.includes(usn))
      .map((usn) => ({
        usn,
        company_name: drive,
        eligibility: true,
      }));
  
    if (validStudentsData.length === 0) {
      console.warn("None of the selected USNs exist in student_info. Aborting insert.");
      return;
    }
  
    console.log("Inserting:", validStudentsData);
  
    const { data: insertedData, error: insertError } = await supabase
      .from("interview_stats")
      .insert(validStudentsData);
  
    if (insertError) {
      console.error("Error inserting data:", insertError);
    } else {
      console.log("Data inserted successfully:", insertedData);
    }
  };
  

  return (
    <form onSubmit={submit}>
      <h2>Eligibility Information</h2>
      <p>Company Name: {company}</p>

      <input
        type="text"
        placeholder="Search by name or USN"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="border-2">
        <thead>
          <tr className="p-5">
            <th className="border-2 px-2">
              <button type="button" onClick={handleSelectAll}>
                {selectAll ? "Deselect All" : "Select All"}
              </button>
            </th>
            <th className="border-2">Name</th>
            <th className="border-2">USN</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.usn} className="border-2">
              <td className="border-2 px-5">
                <input
                  type="checkbox"
                  checked={checkedItems[item.usn] || false}
                  onChange={() => handleCheckboxChange(item.usn)}
                />
              </td>
              <td className="border-2 px-5">{item.name}</td>
              <td className="border-2 px-5">{item.usn}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="submit">Submit</button>
    </form>
  );
};

export default Eligibility;
