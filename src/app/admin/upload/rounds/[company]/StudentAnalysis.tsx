"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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

type Student = {
  usn: string;
  name: string;
  rounds: { [key: string]: boolean };
};


const StudentAnalysis = () => {
  const { company } = useParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [editedStudents, setEditedStudents] = useState<{ [usn: string]: { [round: string]: boolean } }>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectAll = (round: string) => {
    setEditedStudents((prev) => {
      const allSelected = students.every((student) => prev[student.usn]?.[round] ?? false);
  
      return students.reduce((acc, student) => {
        acc[student.usn] = {
          ...prev[student.usn],
          [round]: !allSelected, // Toggle all checkboxes in this round
        };
        return acc;
      }, { ...prev });
    });
  };
  
  

  const fetchStudents = async () => {
    if (!company || isSubmitting) return; // Prevent fetching during submission
    setLoading(true);

    const { data: interviewData, error: interviewError } = await supabase
      .from("interview_stats")
      .select("*")
      .eq("company_name", company)
      .eq("eligibility", true);

    if (interviewError) {
      console.error("Error fetching interview stats:", interviewError.message);
      setLoading(false);
      return;
    }

    const usns = interviewData.map((student) => student.usn);

    const { data: studentData, error: studentError } = await supabase
      .from("student_info")
      .select("usn, name")
      .in("usn", usns);

    if (studentError) {
      console.error("Error fetching student info:", studentError.message);
      setLoading(false);
      return;
    }

    const mergedData: Student[] = interviewData.map((interview) => {
      const { usn, company_name, ...rounds } = interview;

      // Filter only rounds set to `false`
      const filteredRounds = Object.fromEntries(
        Object.entries(rounds).filter(([_, value]) => value === false)
      );

      return {
        usn,
        name: studentData.find((s) => s.usn === usn)?.name || "Unknown",
        rounds: filteredRounds,
      };
    });

    setStudents(mergedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents(); // Initial fetch
    const interval = setInterval(fetchStudents, 2000); // Refresh every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [company, isSubmitting]); // Stop fetching while submitting

//   const handleCheckboxChange = (usn: string, round: string) => {
//     setEditedStudents((prev) => ({
//       ...prev,
//       [usn]: {
//         ...prev[usn],
//         [round]: true, // Mark as passed
//       },
//     }));
//   };
const handleCheckboxChange = (usn: string, round: string) => {
    setEditedStudents((prev) => {
      const currentState = prev[usn]?.[round] ?? false;
      
      return {
        ...prev,
        [usn]: {
          ...prev[usn],
          [round]: !currentState, // Toggle between true and false
        },
      };
    });
  };
  

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const updates = Object.entries(editedStudents).map(async ([usn, rounds]) => {
      return supabase
        .from("interview_stats")
        .update(rounds)
        .eq("usn", usn)
        .eq("company_name", company);
    });

    try {
      await Promise.all(updates);
      setEditedStudents({});
      setSubmitted(true); // Show success message
    } catch (error) {
      console.error("Error submitting changes:", error);
      alert("Failed to update rounds!");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="p-4 border-2 rounded-lg flex flex-col items-center">
      {/* <h2 className="text-xl font-semibold mb-4">Eligible Students for {company}</h2> */}

      {submitted ? (
        <p className="text-green-600 font-bold text-lg">Information submitted successfully!</p>
    //   ) : 
    //   loading ? (
    //     <p>Loading students...</p>
      ) : 
      students.length === 0 ? (
        <p>No eligible students with pending rounds found.</p>
      ) : (
        <div className=" scroll-auto flex flex-col items-center">
            <Table>
            <TableHeader className="gap-5">
                <TableRow>
                <TableHead>USN</TableHead>
                <TableHead>Name</TableHead>
                {Array.from(new Set(students.flatMap((s) => Object.keys(s.rounds)))).map((round) => {
                    const allSelected = students.every((student) => editedStudents[student.usn]?.[round] ?? false);
                    return (
                    <TableHead key={round} className="capitalize">
                        <div className="flex items-center gap-2">
                        
                        <Checkbox
                            checked={allSelected}
                            onCheckedChange={() => selectAll(round)}
                        />
                        <p className="font-bold text-foreground pr-5">{round.replace(/_/g, " ")}</p>
                        </div>
                    </TableHead>
                    );
                })}
                </TableRow>
            </TableHeader>
            <TableBody>
                {students.map((student) => (
                <TableRow key={student.usn}>
                    <TableCell>{student.usn}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    {Array.from(new Set(students.flatMap((s) => Object.keys(s.rounds)))).map((round) => (
                    <TableCell key={round}>
                        {student.rounds.hasOwnProperty(round) ? (
                        <Checkbox
                            checked={editedStudents[student.usn]?.[round] ?? false}
                            onCheckedChange={() => handleCheckboxChange(student.usn, round)}
                        />
                        ) : (
                        "-" // If the student doesn't have this round
                        )}
                    </TableCell>
                    ))}
                </TableRow>
                ))}
            </TableBody>
            </Table>


          <Button
            onClick={handleSubmit}
            className="mt-4"
            disabled={isSubmitting || Object.keys(editedStudents).length === 0}
          >
            {isSubmitting ? "Submitting..." : "Submit Changes"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudentAnalysis;
