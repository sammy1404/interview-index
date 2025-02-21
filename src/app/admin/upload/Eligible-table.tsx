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
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [selectAll, setSelectAll] = useState(false);
  const drive = company

  useEffect(() => {
    const fetchData = async () => {
      let { data: fetchedData, error } = await supabase.from("student_info").select("*");
      if (error) console.error("Error fetching data:", error);
      else {
        setData(fetchedData || []);
        const initialCheckedState = fetchedData?.reduce((acc, item) => {
          acc[item.id] = false;
          return acc;
        }, {} as { [key: string]: boolean });
        setCheckedItems(initialCheckedState);
      }
      setLoading(false);
    };
    
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.usn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAll = () => {
    const newCheckedState = filteredData.reduce((acc, item) => {
      acc[item.id] = !selectAll;
      return acc;
    }, {} as { [key: string]: boolean });

    setCheckedItems((prev) => ({ ...prev, ...newCheckedState }));
    setSelectAll(!selectAll);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const selectedStudents = Object.keys(checkedItems).filter((id) => checkedItems[id]);
    // console.log(selectedStudents) // ids
    // console.log(drive) // company

    const insertStudents = async (students: string[], drive: string) => {
        console.log(students) // ids
        console.log(drive) //drive
        const { data, error } = await supabase
        .from("interview_stats")
        .insert(
          students.map((studentId) => ({
            id: studentId,
            company_name: drive,  // Assuming `drive` holds the company name
            eligibility: true, // Set eligibility to true
          }))
        );
      
      if (error) {
        console.error("Error inserting data:", error);
      } else {
        console.log("Data inserted successfully:", data);
      }
    };

    if (selectedStudents.length > 0) {
      insertStudents(selectedStudents, drive);
    } else {
      console.warn("No students selected for insertion.");
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
            <tr key={item.id} className="border-2">
              <td className="border-2 px-5">
                <input
                  type="checkbox"
                  checked={checkedItems[item.id] || false}
                  onChange={() => handleCheckboxChange(item.id)}
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
