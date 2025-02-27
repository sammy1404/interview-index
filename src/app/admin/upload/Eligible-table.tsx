"use client";

// @typescript-eslint/no-explicit-any

import { useRouter } from "next/navigation"; 
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Stats from "./Stats";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";

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
  const [fileLoading, setFileLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [notFoundUsns, setNotFoundUsns] = useState<string[]>([]);
  const router = useRouter();

  // Get selected students information for display
  const selectedStudents = useMemo(() => {
    if (!data.length) return [];
    return data
      .filter(student => checkedItems[student.usn])
      .map(student => ({ 
        name: student.name, 
        usn: student.usn 
      }));
  }, [data, checkedItems]);
  
  useEffect(() => {
    const fetchData = async () => {
      const { data: fetchedData, error } = await supabase.from("student_info").select("*");
      if (error) console.error("Error fetching data:", error);
      else {
        setData(fetchedData || []);
        const initialCheckedState = fetchedData?.reduce((acc, item) => {
          acc[item.usn] = false;
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
      acc[item.usn] = !selectAll;
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

    const { data: existingStudents, error: fetchError } = await supabase
      .from("student_info")
      .select("usn")
      .in("usn", selectedStudentUsns);

    if (fetchError) {
      console.error("Error fetching student_info:", fetchError);
      return;
    }

    const validUsns = existingStudents?.map((student) => student.usn) || [];
    const validStudentsData = selectedStudentUsns
      .filter((usn) => validUsns.includes(usn))
      .map((usn) => ({
        usn,
        company_name: company,
        eligibility: true,
      }));

    if (validStudentsData.length === 0) {
      console.warn("None of the selected USNs exist in student_info. Aborting insert.");
      return;
    }

    console.log("Inserting:", validStudentsData);

    const { error: insertError } = await supabase.from("interview_stats").insert(validStudentsData);

    if (insertError) {
      console.error("Error inserting data:", insertError);
    } else {
      console.log("Data inserted successfully!");
    }
  };

  const next = () => {
    router.push(`/admin/upload/rounds/${company}`);
  };

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
      console.log("API Response:", usnsFromExcel);
      
      if (Array.isArray(usnsFromExcel) && usnsFromExcel.length > 0) {
        // Create a map of all available USNs in our data for quick lookup
        const existingUsnsMap = data.reduce((acc, student) => {
          acc[student.usn.toLowerCase()] = student.usn;
          return acc;
        }, {} as Record<string, string>);

        // Update checkbox state for USNs that exist in our data
        const newCheckedState = { ...checkedItems };
        const missingUsns: string[] = [];

        usnsFromExcel.forEach(usn => {
          // Try with lowercase for case-insensitive matching
          const normalizedUsn = typeof usn === 'string' ? usn.toLowerCase() : '';
          if (normalizedUsn && existingUsnsMap[normalizedUsn]) {
            // Use the actual USN with proper casing from our data
            const actualUsn = existingUsnsMap[normalizedUsn];
            newCheckedState[actualUsn] = true;
          } else if (usn) {
            missingUsns.push(usn);
          }
        });

        setCheckedItems(newCheckedState);
        setNotFoundUsns(missingUsns);
        
        // Clear search to show all students with their updated selection state
        setSearchTerm("");
        
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

  return (
    <div className="flex flex-col items-center justify-center gap-5 mb-10 w-screen">
      <div className="flex gap-10 flex-with w-full px-10">
        <form className="max-h-screen overflow-auto hide-scroller flex-col items-center justify-center text-center border-2 border-accent-foreground p-2 rounded-xl w-full">
          <h2>Scroll and select all eligible students</h2>
          <div className="flex justify-around h-fit mt-5">
            <Input
              type="text"
              placeholder="Search by name or USN"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-fit"
            />
            <div className="flex items-center gap-2 w-fit">
              <Input 
                id="picture" 
                type="file" 
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="w-fit" 
              />
              <Button
                variant="default"
                onClick={handleFileUpload}
                disabled={fileLoading || !file}
              >
                {fileLoading ? "Processing..." : "Upload Excel"}
              </Button>
              {notFoundUsns.length > 0 && (
                <div className="text-xs text-red-500 mt-1">
                  {notFoundUsns.length} USNs not found
                </div>
              )}
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
        <div className="flex flex-col gap-4 min-w-fit w-1/2">
          <Stats company={company} />
          
          {/* Selected Students Box */}
          <div className="border-2 border-accent-foreground p-4 rounded-xl w-full h-1/2">
            <h3 className="font-semibold text-center mb-3">Selected Students ({selectedStudents.length})</h3>
            <div className="h-[30vh] overflow-y-auto pr-2 hide-scroller">
              {selectedStudents.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-background">
                    <tr>
                      <th className="text-left pb-2">Name</th>
                      <th className="text-right pb-2">USN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudents.map((student) => (
                      <tr key={student.usn} className="hover:bg-muted">
                        <td className="py-1 text-left truncate max-w-[150px]" title={student.name}>
                          {student.name}
                        </td>
                        <td className="py-1 text-right font-mono">{student.usn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-muted-foreground">No students selected</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <button
          className="hover:bg-muted-foreground hover:text-primary-foreground text-ring px-5 py-2 rounded-md transition-all duration-300 mr-3"
          onClick={submit}
        >
          Submit
        </button>
        <button 
          className="hover:bg-muted-foreground hover:text-primary-foreground text-ring px-5 py-2 rounded-md transition-all duration-300" 
          onClick={next}
        >
          Go to the next page
        </button>
      </div>
    </div>
  );
};

export default Eligibility;
