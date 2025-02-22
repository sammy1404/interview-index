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
  } from "@/components/ui/table"

const url: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon_key: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const supabase = createClient(url, anon_key);

// Define the interface for the fetched data
interface StudentInfo {
  name: string | null; // Name can be null if not found
}

interface Student {
  usn: string;
  student_info: StudentInfo; // Change to student_info
}

interface StatsProps {
  company: string;
}

const Stats: React.FC<StatsProps> = ({ company }) => {
  const [students, setStudents] = useState<{ usn: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEligibleStudents = useCallback(async () => {
    try {
      setLoading(true);
  
      const { data, error } = await supabase
        .from<Student>("interview_stats") // Specify the type here
        .select("usn, student_info(name)") // Ensure correct field name
        .eq("eligibility", true)
        .eq("company_name", company);
  
      if (error) throw error;
  
      const formattedData = data.map((item) => ({
        usn: item.usn,
        name: item.student_info?.name || "Unknown", // Accessing name safely
      }));
  
      setStudents(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setStudents([]); // Ensure state consistency on error
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchEligibleStudents();
  }, [fetchEligibleStudents]);

  return (
    <div className="flex flex-col items-center justify-center text-center border-2 border-accent-foreground p-4 rounded-xl ">
      <h2 className="text-lg font-semibold">Stats for {company}</h2>
      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : students.length === 0 ? (
        <p className="mt-4 text-red-500">No eligible students found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-2">USN</TableHead>
              <TableHead className="p-2">Student Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.usn} className="border-b">
                <TableCell className="p-2">{student.usn}</TableCell>
                <TableCell className="p-2">{student.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Stats;
