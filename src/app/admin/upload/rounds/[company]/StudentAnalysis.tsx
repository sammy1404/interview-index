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
  const [changedStudents, setChangedStudents] = useState<Set<string>>(new Set());

  // Function to initialize editedStudents with current database values
  const initializeEditedStudents = (studentsData: Student[]) => {
    const initialState = studentsData.reduce((acc, student) => {
      acc[student.usn] = { ...student.rounds };
      return acc;
    }, {} as { [usn: string]: { [round: string]: boolean } });
    
    setEditedStudents(initialState);
  };

  const selectAll = (round: string) => {
    setEditedStudents((prev) => {
      const allSelected = students.every((student) => prev[student.usn]?.[round] ?? false);
  
      const newState = students.reduce((acc, student) => {
        acc[student.usn] = {
          ...prev[student.usn],
          [round]: !allSelected,
        };
        return acc;
      }, { ...prev });

      // Track which students were changed
      students.forEach(student => {
        if ((prev[student.usn]?.[round] ?? false) !== !allSelected) {
          setChangedStudents(prev => new Set(prev).add(student.usn));
        }
      });
      
      return newState;
    });
  };
  
  const fetchStudents = async () => {
    if (!company || isSubmitting) return;
    setLoading(true);
    setSubmitted(false);

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
      const { usn, company_name, eligibility, ...rounds } = interview;

      const student = studentData.find((s) => s.usn === usn);

      return {
        usn,
        name: student ? student.name : "Unknown",
        rounds: Object.fromEntries(
          Object.entries(rounds)
            .filter(([key]) => key !== "usn" && key !== "company_name" && key !== "eligibility")
            .map(([key, value]) => [key, Boolean(value)])
        ),
      };
    });

    setStudents(mergedData);
    // Initialize editedStudents with current values from database
    initializeEditedStudents(mergedData);
    setLoading(false);
    setChangedStudents(new Set()); // Reset changed students on new fetch
  };

  useEffect(() => {
    fetchStudents();
  }, [company]);

  const handleCheckboxChange = (usn: string, round: string) => {
    setEditedStudents((prev) => {
      const currentState = prev[usn]?.[round] ?? false;
      return {
        ...prev,
        [usn]: {
          ...prev[usn],
          [round]: !currentState,
        },
      };
    });
    
    // Track this student as changed
    setChangedStudents(prev => new Set(prev).add(usn));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Only update students that were actually changed
    const updates = Array.from(changedStudents).map(async (usn) => {
      const studentRounds = editedStudents[usn];
      if (studentRounds) {
        return supabase
          .from("interview_stats")
          .update(studentRounds)
          .eq("usn", usn)
          .eq("company_name", company);
      }
    });

    try {
      await Promise.all(updates);
      setSubmitted(true);
      setChangedStudents(new Set()); // Reset changed students after successful submission
      
      // Refresh the data after submission
      await fetchStudents();
    } catch (error) {
      console.error("Error submitting changes:", error);
      alert("Failed to update rounds!");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="p-4 border-2 rounded-lg flex flex-col items-center">
      {submitted ? (
        <div className="mb-4">
          <p className="text-green-600 font-bold text-lg">Information submitted successfully!</p>
          <Button onClick={() => setSubmitted(false)} className="mt-2">Continue Editing</Button>
        </div>
      ) : loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No eligible students with pending rounds found.</p>
      ) : (
        <div className="scroll-auto flex flex-col items-center w-[80vw] hide-scroller">
          <Table className="hide-scroller">
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
            <TableBody className="hide-scroller">
              {students.map((student) => (
                <TableRow key={student.usn} className={changedStudents.has(student.usn) ? "bg-muted/50" : ""}>
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
                        "-"
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
            disabled={isSubmitting || changedStudents.size === 0}
          >
            {isSubmitting ? "Submitting..." : `Submit Changes (${changedStudents.size} students)`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudentAnalysis;