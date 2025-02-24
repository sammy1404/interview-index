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
  name: string;
}

interface StatsProps {
  company: string;
}

const Stats: React.FC<StatsProps> = ({ company }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch students from interview_stats with their names
  const fetchEligibleStudents = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("interview_stats")
        .select("usn, student_info (name)") // Ensure correct relationship
        .eq("eligibility", true)
        .eq("company_name", company);

      if (error) throw error;

      const formattedData = data.map((item) => ({
        usn: item.usn,
        name: item.student_info?.name ?? "Unknown", // Avoid undefined values
      }));

      setStudents(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setStudents([]); // Ensure state consistency on failure
    } finally {
      setLoading(false);
    }
  }, [company]); // Add `company` as a dependency

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
  }, [fetchEligibleStudents]);

  return (
    <div className="flex flex-col items-center justify-center text-center border-2 border-accent-foreground p-4 rounded-xl">
      <h2 className="text-lg font-semibold">Students eligible for: {company}</h2>
      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : students.length === 0 ? (
        <p className="mt-4 text-red-500">No eligible students found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-2 text-center">USN</TableHead>
              <TableHead className="p-2 text-center">Student Name</TableHead>
              <TableHead className="p-2 text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map(({ usn, name }) => (
              <TableRow key={usn} className="border-b">
                <TableCell className="p-2 text-center">{usn}</TableCell>
                <TableCell className="p-2 text-center">{name}</TableCell>
                <TableCell className="delete">
                  <button onClick={() => deleteStudent(usn)} className="text-red-500">Delete</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Stats;
