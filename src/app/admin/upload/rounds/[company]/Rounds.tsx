"use client";

import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


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
    const newValue = (round == 'virtual' || round == 'on_campus') ? (checked ? true : null) : (checked ? false : null); // Set false if checked, null if unchecked
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
    <div className="flex flex-col items-center text-center border-4 border-border p-4 rounded-xl h-fit w-fit overflow-auto hide-scroller w-full">
      <h2 className="text-sm">Select the rounds in the drive</h2>
      <p className="text-lg text-red-400">Company Name: {company}</p>
      <div className="grid grid-cols-5 p-5 w-full">
        <div className="col-span-1 flex">
          <RadioGroup
            defaultValue=""
            onValueChange={(value) => handleCheckboxClick(value as keyof RoundsType, true)}
          >
            {Object.keys(rounds).map((round) =>
              round === "virtual" || round === "on_campus" ? (
                <div key={round} className="flex items-center gap-2">
                  <RadioGroupItem value={round} id={round} />
                  <Label htmlFor={round} className="capitalize">
                    {round.replace(/_/g, " ")}
                  </Label>
                </div>
              ) : null
            )}
          </RadioGroup>
        </div>
        <div className="col-span-4 grid grid-cols-5 gap-y-3">
          {Object.keys(rounds).map((round) =>
            round !== "virtual" && round !== "on_campus" ? (
              <div key={round} className="items-center gap-2 flex">
                <Checkbox
                  id={round}
                  onCheckedChange={(checked) => handleCheckboxClick(round as keyof RoundsType, checked as boolean)}
                />
                <Label htmlFor={round} className="capitalize">
                  {round === "gd" ? "Group Discussion" : round.replace(/_/g, " ")}
                </Label>
              </div>
            ) : null
          )}
        </div>
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