"use client"
import { useState, useEffect } from 'react';
import { getCompanyRounds, updateCompanyRounds } from '../server/company_rounds';

// Available rounds that can be selected for a company
const availableRounds = [
  "Aptitude Test", "Group Discussion", "Technical Round 1", 
  "Technical Round 2", "HR Round", "Final Interview"
];

export default function RoundsManagement() {
  const [companies, setCompanies] = useState<{id: string, name: string}[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedRounds, setSelectedRounds] = useState<string[]>([]);
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

  // Load company rounds when company selection changes
  useEffect(() => {
    const fetchCompanyRounds = async () => {
      if (!selectedCompany) return;
      
      setIsLoading(true);
      const rounds = await getCompanyRounds(selectedCompany);
      
      if (rounds && rounds.length > 0) {
        // Assuming rounds is stored as an array in the first result
        setSelectedRounds(rounds[0].rounds || []);
      } else {
        setSelectedRounds([]);
      }
      
      setIsLoading(false);
    };
    
    fetchCompanyRounds();
  }, [selectedCompany]);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompany(e.target.value);
  };

  const handleRoundToggle = (round: string) => {
    setSelectedRounds(prev => {
      if (prev.includes(round)) {
        return prev.filter(r => r !== round);
      } else {
        return [...prev, round];
      }
    });
  };

  const handleSubmit = async () => {
    if (!selectedCompany) {
      setMessage("Please select a company");
      return;
    }
    
    setIsLoading(true);
    const success = await updateCompanyRounds(selectedCompany, selectedRounds);
    
    if (success) {
      setMessage("Rounds updated successfully");
    } else {
      setMessage("Failed to update rounds");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Company Rounds Management</h2>
      
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
      
      {selectedCompany && (
        <>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Select Rounds:</h3>
            <div className="space-y-2">
              {availableRounds.map(round => (
                <label key={round} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedRounds.includes(round)}
                    onChange={() => handleRoundToggle(round)}
                    className="form-checkbox"
                  />
                  <span>{round}</span>
                </label>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? "Updating..." : "Update Rounds"}
          </button>
        </>
      )}
    </div>
  );
}
