"use client";

import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const url: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon_key: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabase = createClient(url, anon_key);

type RoundsType = {
  virtual: boolean | null;
  on_campus: boolean | null;
  applied: boolean | null;
  shortlisted: boolean | null;
  attended: boolean | null;
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
  hr_round: boolean | null;
  placed: boolean | null;
};

// Default all rounds to `null`
const defaultRounds: RoundsType = {
  virtual: null,
  on_campus: null,
  applied: null,
  shortlisted: null,
  attended: null,
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
  hr_round: null,
  placed: null,
};

interface RoundsProps {
  company: string;
}

const Rounds: React.FC<RoundsProps> = ({ company }) => {
  const [rounds, setRounds] = useState<RoundsType>(defaultRounds);
  const [loading, setLoading] = useState(false);

  // Handle checkbox click
  const handleCheckboxClick = (round: keyof RoundsType, checked: boolean) => {
    const newValue = checked ? false : null; // Set false if checked, null if unchecked
    setRounds((prevRounds) => ({
      ...prevRounds,
      [round]: newValue,
    }));
  };

  // Handle submit
  const handleSubmit = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("interview_stats")
      .update(rounds) // Update all rounds at once
      .eq("company_name", company);

    setLoading(false);

    if (error) {
      console.error("Error updating rounds:", error.message);
      alert("Failed to update rounds!");
    } else {
      console.log("Rounds updated successfully!");
    }
  };

  return (
    <div className="flex flex-col items-center text-center border-4 border-border p-4 rounded-xl h-fit w-fit overflow-auto hide-scroller">
      <h2 className="text-sm">Select the rounds in the drive</h2>
      <p className="text-lg text-red-400">Company Name: {company}</p>

      <div className="grid grid-cols-6 gap-y-33 p-5 gap-x-5">
        {Object.keys(rounds).map((round) => (
          <label key={round} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={rounds[round as keyof RoundsType] === false} // Only show ticked if false
              onCheckedChange={(checked) => handleCheckboxClick(round as keyof RoundsType, checked as boolean)}
            />
            <span className="capitalize">{round === "gd" ? "Group Discussion" : round.replace(/_/g, " ")}</span>
          </label>
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Updating..." : "Submit"}
      </Button>
    </div>
  );
};

export default Rounds;