"use client"

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Checkbox } from "@/components/ui/checkbox";

const url: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon_key: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const supabase = createClient(url, anon_key);

// Define the type for the rounds
type RoundsType = {
  applied: boolean | null;
  shortlisted: boolean | null;
  attended: boolean | null;
  virtual: boolean | null;
  on_campus: boolean | null;
  resume_screening: boolean | null;
  aptitude: boolean | null;
  technical_mcq: boolean | null;
  coding_1: boolean | null;
  coding_2: boolean | null;
  gd: boolean | null;
  technical_interview_1: boolean | null;
  technical_interview_2: boolean | null;
  assignment: boolean | null;
  managerial_round: boolean | null;
  hr_round: boolean;
  placed: boolean;
};

// Initialize the default rounds
const defaultRounds: RoundsType = {
  applied: null,
  shortlisted: null,
  attended: null,
  virtual: null,
  on_campus: null,
  resume_screening: null,
  aptitude: null,
  technical_mcq: null,
  coding_1: null,
  coding_2: null,
  gd: null,
  technical_interview_1: null,
  technical_interview_2: null,
  assignment: null,
  managerial_round: null,
  hr_round: false,
  placed: false,
};

interface RoundsProps {
  company: string;
}

const Rounds: React.FC<RoundsProps> = ({ company }) => {
  const [rounds, setRounds] = useState<RoundsType>(defaultRounds);
  const [loading, setLoading] = useState(false);

  // Toggle the state of a round
  const toggleRound = (round: keyof RoundsType) => {
    setRounds((prevRounds) => ({
      ...prevRounds,
      [round]: prevRounds[round] === null ? false : !prevRounds[round],
    }));
  };

  // Submit function to update Supabase
  const handleSubmit = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("interview_stats")
      .update({ ...rounds })
      .eq("company_name", company);

    setLoading(false);

    if (error) {
      console.error("Error updating rounds:", error.message);
      alert("Failed to update rounds!");
    } else {
      console.log("Rounds updated successfully!");
      alert("Rounds updated successfully!");
    }
  };

  return (
    <div className='flex flex-col items-center justify-center text-center border-2 border-accent-foreground p-4 rounded-xl h-fit'>
      <h2 className='text-sm'>Select the rounds in the drive</h2>
      <p className='text-lg text-red-500'>Company Name: {company}</p>
      
      <div className='grid grid-cols-2 gap-2 mt-4'>
        {Object.keys(rounds).map((round) => (
          <label key={round} className='flex items-center gap-2'>
            <Checkbox checked={rounds[round as keyof RoundsType] === true} onCheckedChange={() => toggleRound(round as keyof RoundsType)} />
            <span className='capitalize'>{round.replace('_', ' ')}</span>
          </label>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className='mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-80 disabled:bg-gray-400'
        disabled={loading}
      >
        {loading ? "Updating..." : "Submit"}
      </button>
    </div>
  );
};

export default Rounds;
