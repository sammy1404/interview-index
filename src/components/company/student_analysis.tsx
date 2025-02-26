"use client"
import { useState, useEffect } from 'react';
import { getCompanyRounds, getEligibleStudents, updateStudentRoundStatus } from '../server/company_rounds';

type Student = {
  id: string;
  usn: string;
  name: string;
  student_info: {
    name: string;
    usn: string;
    // Add other student fields as needed
  };
  [key: string]: any; // For dynamic round fields
};

export default function StudentAnalysis() {
  const [companies, setCompanies] = useState<{id: string, name: string}[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [companyRounds, setCompanyRounds] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load companies when component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      // You need to implement a function to fetch companies from your database
      // For now, we'll use dummy data
      setCompanies([
        { id: "1", name: "Google" },
        { id: "2", name: "Microsoft" },
        { id: "3", name: "Amazon" }
      ]);
    };
    
    fetchCompanies();
  }, []);

  // Load company rounds and students when company selection changes
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!selectedCompany) return;
      
      setIsLoading(true);
      
      // Get company rounds
      const rounds = await getCompanyRounds(selectedCompany);
      if (rounds && rounds.length > 0) {
        setCompanyRounds(rounds[0].rounds || []);
      } else {
        setCompanyRounds([]);
      }
      
      // Get eligible students
      const eligibleStudents = await getEligibleStudents(selectedCompany);
      if (eligibleStudents) {
        setStudents(eligibleStudents);
      } else {
        setStudents([]);
      }
      
      setIsLoading(false);
    };
    
    fetchCompanyData();
  }, [selectedCompany]);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompany(e.target.value);
  };

  const handleRoundStatusChange = (studentId: string, round: string, status: boolean) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        return { ...student, [round]: status };
      }
      return student;
    }));
  };

  const handleSaveStudentStatus = async (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const roundUpdates: Record<string, boolean | null> = {};
    companyRounds.forEach(round => {
      // Only include rounds that have values (not undefined)
      if (student[round] !== undefined) {
        roundUpdates[round] = student[round];
      }
    });
    
    setIsLoading(true);
    const success = await updateStudentRoundStatus(studentId, selectedCompany, roundUpdates);
    
    if (success) {
      setMessage(`Updated rounds for student ${student.student_info.name}`);
    } else {
      setMessage(`Failed to update rounds for student ${student.student_info.name}`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Student Analysis</h2>
      
      {message && (
        <div className="mb-4 p-2 bg-blue-100 border border-blue-300 rounded">
          {message}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block mb-2">Select Company:</label>
        <select 
          value={selectedCompany} 
          onChange={handleCompanyChange}
          className="border p-2 w-full rounded"
        >
          <option value="">-- Select Company --</option>
          {companies.map(company => (
            <option key={company.id} value={company.id}>{company.name}</option>
          ))}
        </select>
      </div>
      
      {selectedCompany && companyRounds.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 border-r text-left">USN</th>
                <th className="py-2 px-4 border-r text-left">Name</th>
                {companyRounds.map(round => (
                  <th key={round} className="py-2 px-4 border-r text-left">{round}</th>
                ))}
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="border-b">
                  <td className="py-2 px-4 border-r">{student.student_info.usn}</td>
                  <td className="py-2 px-4 border-r">{student.student_info.name}</td>
                  {companyRounds.map(round => (
                    <td key={round} className="py-2 px-4 border-r">
                      <select
                        value={String(student[round])}
                        onChange={(e) => {
                          const value = e.target.value;
                          let status: boolean | null = null;
                          
                          if (value === 'true') status = true;
                          else if (value === 'false') status = false;
                          
                          handleRoundStatusChange(student.id, round, status as boolean);
                        }}
                        className="border p-1 w-full"
                      >
                        <option value="null">Not Evaluated</option>
                        <option value="true">Pass</option>
                        <option value="false">Fail</option>
                      </select>
                    </td>
                  ))}
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleSaveStudentStatus(student.id)}
                      className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 text-sm"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : selectedCompany ? (
        <p>No rounds configured for this company. Please add rounds first.</p>
      ) : null}
    </div>
  );
}
