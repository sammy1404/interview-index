"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

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
    <div className="p-4">
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
        <>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">USN</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Rounds</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.usn} className="border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">{student.usn}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                  <td className="border border-gray-300 px-4 py-2 flex gap-2">
                    {Object.keys(student.rounds).map((round) => (
                      <label key={round} className="flex items-center space-x-2">
                        <Checkbox
                          checked={editedStudents[student.usn]?.[round] ?? false}
                          onCheckedChange={() => handleCheckboxChange(student.usn, round)}
                        />
                        <span className="capitalize">{round.replace(/_/g, " ")}</span>
                      </label>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            onClick={handleSubmit}
            className="mt-4"
            disabled={isSubmitting || Object.keys(editedStudents).length === 0}
          >
            {isSubmitting ? "Submitting..." : "Submit Changes"}
          </Button>
        </>
      )}
    </div>
  );
};

export default StudentAnalysis;
