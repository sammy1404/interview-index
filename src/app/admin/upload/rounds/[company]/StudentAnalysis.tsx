"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";


const url: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon_key: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabase = createClient(url, anon_key);

type Student = {
  usn: string;
  name: string;
  rounds: { [key: string]: boolean | null };
};

// Columns to exclude from round operations
const excludedColumns = ["created_at", "updated_at", "id", "usn", "company_name", "eligibility"];

const StudentAnalysis = () => {
  const { company } = useParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [editedStudents, setEditedStudents] = useState<{ [usn: string]: { [round: string]: boolean } }>({});
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roundFields, setRoundFields] = useState<string[]>([]);
  const [companyRounds, setCompanyRounds] = useState<{ [key: string]: boolean | null }>({});
  const [file, setFile] = useState<File | null>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [notFoundUsns, setNotFoundUsns] = useState<string[]>([]);
  const [processedStudents, setProcessedStudents] = useState<Set<string>>(new Set());

  // Function to select all students for a specific round
  const selectAll = (round: string) => {
    if (excludedColumns.includes(round) || companyRounds[round] === null) return;
    
    setEditedStudents((prev) => {
      // Check if all currently visible students are selected for this round
      const allSelected = filteredStudents.every(
        (student) => {
          if (student.rounds[round] === null) return true;
          return (prev[student.usn]?.[round] ?? student.rounds[round]) === true;
        }
      );
  
      return filteredStudents.reduce((acc, student) => {
        if (!acc[student.usn]) {
          acc[student.usn] = {};
        }
        
        // Only update rounds that exist for this student
        if (student.rounds[round] !== null) {
          acc[student.usn] = {
            ...acc[student.usn],
            [round]: !allSelected,
          };
        }
        return acc;
      }, { ...prev });
    });
  };

  // Handle student selection
  const toggleSelectAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.usn));
    }
  };

  const toggleStudentSelection = (usn: string) => {
    setSelectedStudents(prev => 
      prev.includes(usn)
        ? prev.filter(id => id !== usn)
        : [...prev, usn]
    );
  };

  const fetchStudents = async () => {
    if (!company || isSubmitting) return;
    setLoading(true);

    try {
      // First, fetch the company's rounds configuration
      const { data: companyData, error: companyError } = await supabase
        .from("interview_stats")
        .select("*")
        .eq("company_name", company)
        .limit(1);

      if (companyError) {
        console.error("Error fetching company rounds:", companyError);
      } else if (companyData && companyData.length > 0) {
        // Extract rounds, excluding non-round fields
        const companyRecord = companyData[0];
        const rounds = Object.fromEntries(
          Object.entries(companyRecord)
          .filter(([key]) => !excludedColumns.includes(key))
        );
        {/*@ts-ignore*/}
        setCompanyRounds(rounds);
      }

      // Fetch eligible students for this company
      const { data: interviewData, error: interviewError } = await supabase
        .from("interview_stats")
        .select("*")
        .eq("company_name", company)
        .eq("eligibility", true);


      if (interviewError) {
        console.error("Error fetching interview stats:", interviewError);
        setLoading(false);
        return;
      }

      // Identify round fields from the data
      if (interviewData.length > 0) {
        const allFields = Object.keys(interviewData[0]);
        const identifiedRoundFields = allFields.filter(field => !excludedColumns.includes(field));
        setRoundFields(identifiedRoundFields);
      }

      // Get student names
      const usns = interviewData.map((student) => student.usn);
      const { data: studentData, error: studentError } = await supabase
        .from("student_info")
        .select("usn, name")
        .in("usn", usns);

      if (studentError) {
        console.error("Error fetching student info:", studentError);
        setLoading(false);
        return;
      }

      // Get the current set of student USNs we've already processed
      const currentProcessedUsns = new Set(processedStudents);
      
      // Merge the data
      const mergedData = interviewData.map((interview) => {
        const { usn } = interview;
        const student = studentData.find((s) => s.usn === usn);
        
        // Extract only round fields
        const rounds = Object.fromEntries(
          Object.entries(interview)
            .filter(([key]) => !excludedColumns.includes(key))
        );

        // Add this student to our processed set
        currentProcessedUsns.add(usn);

        return {
          usn,
          name: student ? student.name : "Unknown",
          rounds,
        };
      });

      // Update the set of students we've seen
      setProcessedStudents(currentProcessedUsns);
      {/*// @ts-ignore */}
      setStudents(mergedData);
      {/* @ts-ignore */}
      setFilteredStudents(mergedData);
      
      // Don't reset editedStudents entirely, as we might have pending changes
      // Just make sure we're not tracking non-existent students
      setEditedStudents(prev => {
        const existingUsns = new Set(mergedData.map(s => s.usn));
        return Object.fromEntries(
          Object.entries(prev).filter(([usn]) => existingUsns.has(usn))
        );
      });
    } catch (e) {
      console.error("Error in fetchStudents:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [company]);

  // Filter students based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredStudents(
        students.filter(
          student => 
            student.name.toLowerCase().includes(query) || 
            student.usn.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, students]);

  const handleCheckboxChange = (usn: string, round: string) => {
    // Skip excluded columns but allow changing null rounds
    if (excludedColumns.includes(round)) return;
    
    const student = students.find(s => s.usn === usn);
    if (!student) return;
    
    setEditedStudents((prev) => {
      const newState = { ...prev };
      
      if (!newState[usn]) {
        newState[usn] = {};
      }
      
      // Get current value with proper fallback
      const currentValue = newState[usn]?.[round] !== undefined 
        ? newState[usn][round] 
        : student.rounds[round] === true;
      
      newState[usn] = {
        ...newState[usn],
        [round]: !currentValue,
      };
      
      return newState;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const studentsToUpdate = selectedStudents.length > 0
      ? selectedStudents
      : Object.keys(editedStudents);

    try {
      for (const usn of studentsToUpdate) {
        if (!editedStudents[usn]) continue;
        
        // Find the student to make sure we're only updating non-null rounds
        const student = students.find(s => s.usn === usn);
        if (!student) continue;

        // Only include rounds that aren't null in the original data
        // AND only include rounds that have actually been edited
        const updateObj = Object.entries(editedStudents[usn])
          .filter(([key]) => {
            // Only update rounds that:
            // 1. Are valid for this student (not null)
            // 2. Have actually changed from their original value
            return student.rounds[key] !== null && 
                   editedStudents[usn][key] !== student.rounds[key];
          })
          .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
          }, {} as Record<string, boolean>);
        
        // Only update if there are actual changes
        if (Object.keys(updateObj).length > 0) {
          await supabase
            .from("interview_stats")
            .update(updateObj)
            .eq("usn", usn)
            .eq("company_name", company);
        }
      }
      
      setSubmitted(true);
      
      setTimeout(() => {
        setSubmitted(false);
        fetchStudents(); // Refresh data
      }, 2000);
    } catch (error) {
      console.error("Error updating student data:", error);
      alert("Failed to update rounds! Check console for details.");
    }

    setIsSubmitting(false);
    setSelectedStudents([]);
  };

  const isRoundChecked = (student: Student, round: string): boolean => {
    // First check if this student has an edited state for this round
    if (editedStudents[student.usn]?.[round] !== undefined) {
      return editedStudents[student.usn][round];
    }
    
    // Otherwise, check the original data
    // Only return true if the round is explicitly true (not null or false)
    return student.rounds[round] === true;
  };

  const isRoundIndeterminate = (round: string): boolean => {
    // All students are now eligible for this check, regardless of null status
    const checkedCount = filteredStudents.filter(
      student => isRoundChecked(student, round)
    ).length;
    
    return checkedCount > 0 && checkedCount < filteredStudents.length;
  };

  const isAllRoundChecked = (round: string): boolean => {
    // All students are now eligible for this check, regardless of null status
    return filteredStudents.length > 0 && 
      filteredStudents.every(student => isRoundChecked(student, round));
  };

  // Update displayRoundNames to only show rounds that exist and have non-null values
  const displayRoundNames = roundFields.filter(field => 
    !excludedColumns.includes(field) && 
    // Check if any student has a non-null value for this round
    students.some(student => student.rounds[field] !== null)
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    
    setFileLoading(true);
    setNotFoundUsns([]);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/fileprocess', {
        method: 'POST',
        body: formData,
      });
      
      const usnsFromExcel = await response.json();

      if (Array.isArray(usnsFromExcel) && usnsFromExcel.length > 0) {
        // Create a map of all available USNs in our data for quick lookup
        const extractedUSNs = new Set(usnsFromExcel.map((usn) => usn.toLowerCase().trim()))
        const matchedStudents = students.filter((student) => 
          extractedUSNs.has(student.usn.toLowerCase().trim())
        ); 
        setFilteredStudents(matchedStudents);
        console.log(matchedStudents);

        const existingUsnsMap = students.reduce((acc, student) => {
          acc[student.usn.toLowerCase()] = student.usn;
          return acc;
        }, {} as Record<string, string>);

        const foundUsns: string[] = [];
        const missingUsns: string[] = [];

        usnsFromExcel.forEach(usn => {
          const normalizedUsn = typeof usn === 'string' ? usn.toLowerCase() : '';
          if (normalizedUsn && existingUsnsMap[normalizedUsn]) {
            foundUsns.push(existingUsnsMap[normalizedUsn]);
          } else if (usn) {
            missingUsns.push(usn);
          }
        });

        setSelectedStudents(foundUsns);
        setNotFoundUsns(missingUsns);
        
        // Clear search to show all students with their updated selection state
        setSearchQuery("");
        
        if (missingUsns.length > 0) {
          alert(`${missingUsns.length} USNs from Excel file were not found in the student list.`);
        }
      } else {
        alert("No valid USNs found in the Excel file or invalid format.");
      }
      
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error processing Excel file. Please check the console for details.");
    } finally {
      setFileLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchStudents();
  };

  return (
    <div className="p-4 border-4 rounded-lg flex flex-col items-center w-full mx-10">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Student Round Progress: {company}</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {submitted ? (
        <div className="text-green-600 font-bold text-lg p-4">
          <p>Information submitted successfully!</p>
        </div>
      ) : loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No eligible students found.</p>
      ) : (
        <>
          <div className="flex w-full items-center justify-between mb-4 px-5 py-3 rounded-lg">
            <div className="relative w-1/3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students by name or USN..."
                className="pl-8"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Input 
                id="picture" 
                type="file" 
                accept=".xlsx, .xls"
                onChange={handleFileChange} 
                className="w-60"
              />
              <Button
                variant="outline"
                onClick={handleFileUpload}
                disabled={fileLoading || !file}
              >
                {fileLoading ? "Processing..." : "Upload Excel"}
              </Button>
              {notFoundUsns.length > 0 && (
                <span className="text-xs text-red-500">
                  {notFoundUsns.length} USNs not found
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span>{selectedStudents.length} students selected</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedStudents([])}
                disabled={selectedStudents.length === 0}
              >
                Clear Selection
              </Button>
            </div>
          </div>

          <div className="w-full overflow-auto max-h-[70vh]">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={filteredStudents.length > 0 && selectedStudents.length === filteredStudents.length}
                      onCheckedChange={toggleSelectAllStudents}
                    />
                  </TableHead>
                  <TableHead className="w-40">USN</TableHead>
                  <TableHead className="w-64">Name</TableHead>
                  {displayRoundNames.map((round) => ( round != "virtual" && round != "on_campus" ?
                    <TableHead key={round} className="capitalize text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Checkbox
                          checked={isAllRoundChecked(round)}
                          data-state={isRoundIndeterminate(round) ? "indeterminate" : ""}
                          onCheckedChange={() => selectAll(round)}
                        />
                        <span className="whitespace-nowrap text-xs">
                          {round === "gd" ? "Group Discussion" : round.replace(/_/g, " ")}
                        </span>
                      </div>
                    </TableHead>
                    : null
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.usn} className={selectedStudents.includes(student.usn) ? "bg-muted/50" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudents.includes(student.usn)}
                        onCheckedChange={() => toggleStudentSelection(student.usn)}
                      />
                    </TableCell>
                    <TableCell>{student.usn}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    {displayRoundNames.map((round) => ( round != "virtual" && round != "on_campus" ?
                      <TableCell key={round} className="text-center">
                        <Checkbox
                          checked={isRoundChecked(student, round)}
                          onCheckedChange={() => handleCheckboxChange(student.usn, round)}
                          disabled={companyRounds[round] === null}
                        />
                      </TableCell>
                      : null
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || Object.keys(editedStudents).length === 0}
              variant="default"
            >
              {isSubmitting ? "Updating..." : selectedStudents.length > 0 
                ? `Update ${selectedStudents.length} Selected Students` 
                : `Update ${Object.keys(editedStudents).length} Students`}
            </Button>
            {selectedStudents.length > 0 && (
              <Button variant="outline" onClick={() => setSelectedStudents([])}>
                Cancel Selection
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentAnalysis;
