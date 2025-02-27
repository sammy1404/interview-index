"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const url: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon_key: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabase = createClient(url, anon_key);

// Define the interface for fetched student data
interface Student {
  usn: string;
  student_info: {
    name: string | null;
  } | null;
}


interface StatsProps {
  company: string;
}

const Stats: React.FC<StatsProps> = ({ company }) => {
  const [students, setStudents] = useState<Student[]>([]);

  // Fetch students from interview_stats with their names
const fetchEligibleStudents = useCallback(async () => {
  try {
    const { data, error } = await supabase
      .from("interview_stats")
      .select("usn, student_info (name)")
      .eq("eligibility", true)
      .eq("company_name", company);

    if (error) throw error;

    const formattedData = (data as unknown as Student[]).map((item) => ({
      usn: item.usn,
      student_info: item.student_info
    }));

    console.log("Fetched Data:", formattedData);

    setStudents(formattedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    setStudents([]);
  }
}, [company, students]);


  const deleteStudent = async (usn: string) => {
    // Confirm deletion
    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (!confirmed) return; // Exit if not confirmed

    try {
      const { error } = await supabase
        .from("interview_stats")
        .delete()
        .eq("usn", usn);

      if (error) throw error;

      // Update the state to remove the deleted student
      setStudents((prevStudents) => prevStudents.filter(student => student.usn !== usn));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  useEffect(() => {
    fetchEligibleStudents();

  }, [company, fetchEligibleStudents],);

  return (
    <div className="flex flex-col items-center text-center border-2 border-accent-foreground p-4 rounded-xl w-full h-1/2">
      <h2 className="text-lg font-semibold">Students eligible for: {company}</h2>
      {/* {loading ? (
        <p className="mt-4">Loading...</p>
      ) : students.length === 0 ? (
        <p className="mt-4 text-red-500">No eligible students found.</p>
      ) : ( */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-2 text-center">USN</TableHead>
              <TableHead className="p-2 text-center">Student Name</TableHead>
              <TableHead className="p-2 text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map(({ usn, student_info }) => (
              <TableRow key={usn} className="border-b">
                <TableCell className="p-2 text-center">{usn}</TableCell>
                <TableCell className="p-2 text-center">{student_info?.name}</TableCell>
                <TableCell className="delete">
                  <button onClick={() => deleteStudent(usn)} className="text-popover bg-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500 transition-all duration-300 ease-in-out transform hover:scale-105">Delete</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      {/* )} */}
    </div>
  );
};

export default Stats;
