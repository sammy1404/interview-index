"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Stats from "./Stats";



import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

import { Checkbox } from "@/components/ui/checkbox"

  

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
      const { data: fetchedData, error } = await supabase.from("student_info").select("*");
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
    <div className="flex flex-col items-center justify-center gap-5 mb-10">
    <div className="flex gap-10">
          <form className="h-[80vh] overflow-auto hide-scroller flex-col items-center justify-center text-center border-2 border-accent-foreground p-2 rounded-xl">

<h2>Scroll and select all eligible students</h2>
<div className="flex justify-around">
<input
  className="my-3 bg-muted placeholder:text-input text-sm px-3 py-1 rounded-md"
  type="text"
  placeholder="Search by name or USN"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
  <div className="grid items-center">
  <Input id="picture" type="file" />
  </div>

</div>

<Table>
<TableHeader>
<TableRow>
<TableHead>
  <button className="font-bold" type="button" onClick={handleSelectAll}>
    {selectAll ? "Deselect All" : "Select All"}
  </button>
</TableHead>
<TableHead>Name</TableHead>
<TableHead>USN</TableHead>
</TableRow>
</TableHeader>
<TableBody>
{filteredData.map((item) => (
<TableRow key={item.usn}>
  <TableCell>
    <label className="flex items-center">
    <Checkbox
      checked={checkedItems[item.usn] || false}
      onCheckedChange={() => handleCheckboxChange(item.usn)}
      />

    </label>
  </TableCell>
  <TableCell>{item.name}</TableCell>
  <TableCell>{item.usn}</TableCell>
</TableRow>
))}
</TableBody>
</Table>


</form>
<Stats company={company}/>
</div>
<div>
<button className="hover:bg-muted-foreground hover:text-primary-foreground text-ring px-5 py-2 rounded-md transition-all duration-300" onClick={submit}>Submit</button>

</div>



    </div>
  );
};

export default Eligibility;
