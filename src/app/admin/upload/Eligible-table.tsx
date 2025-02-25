"use client";

import { useRouter } from "next/navigation"; 
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedItems, setCheckedItems] = useState<string[]>([]); // Should be an array
  const [selectAll, setSelectAll] = useState(false);
  const router = useRouter(); 

  // Excel handling state variables
  const [file, setFile] = useState<File | null>(null);
  const [pulledList, setExcelList] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("student_info").select("*");
      if (error) console.error("Error fetching data:", error);
      setData(data);
    };
    fetchData();
  }, []);

  if (!data.length) {
    return <div>Loading students...</div>;
  }

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.usn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (usn: string) => { setCheckedItems((prev) =>
      prev.includes(usn) ? prev.filter((item) => item !== usn) : [...prev, usn]
    );
  };

  const handleSelectAll = () => {
    setCheckedItems((prevChecked) => {
      if (prevChecked.length === filteredData.length) {
        return []; // If all are selected, deselect all
      } else {
        return filteredData.map((item) => item.usn); // Otherwise, select all filtered items
      }
    });
    setSelectAll((prev) => !prev); // Toggle select all state
  };

  const next = () => {
    router.push(`/admin/upload/rounds/${company}`);
  };

  // Handling Excel file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a valid file!");
      return;
    }

    const formData = new FormData;
    formData.append('file', file);

    const response = await fetch("/api/fileprocess", {
      method:  "POST",
      body: formData
    })

    const data = response.json();
    console.log(data);

  };

  return (
    <>
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
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                <button type="button" onClick={handleUpload}>
                  Upload File
                </button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="font-bold"
                      type="button"
                      onClick={handleSelectAll}
                    >
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
                          checked={checkedItems.includes(item.usn)}
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
        </div>
        <div>
          <button
            className="hover:bg-muted-foreground hover:text-primary-foreground text-ring px-5 py-2 rounded-md transition-all duration-300"
            onClick={next}
          >
            Go to the next page
          </button>
        </div>
      </div>
      <div className="h-[80vh] overflow-scroll flex flex-col items-center text-center border-2 border-accent-foreground p-4 rounded-xl w-[350px]">
        <h2 className="text-lg font-semibold">Students being updated for: {company}</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-2 text-center">USN</TableHead>
              <TableHead className="p-2 text-center">Student Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checkedItems.map((usn) => {
              const student = data.find((item) => item.usn === usn);
              return (
                <TableRow key={usn} className="border-b">
                  <TableCell className="p-2 text-center">{usn}</TableCell>
                  <TableCell className="p-2 text-center">{student?.name || "Unknown"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Eligibility;
