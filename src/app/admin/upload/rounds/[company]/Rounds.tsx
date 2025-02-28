"use client";

import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { La_Belle_Aurore } from "next/font/google";


const url: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon_key: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabase = createClient(url, anon_key);

type RoundsType = {
  virtual: boolean | null;
  on_campus: boolean | null;
  applied: boolean;
  shortlisted: boolean;
  attended: boolean;
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
  placed: boolean;
};

// Default all rounds to `null`
const defaultRounds: RoundsType = {
  virtual: null,
  on_campus: null,
  applied: false,
  shortlisted: false,
  attended: false,
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
  placed: false,
};

interface RoundsProps {
  company: string;
}

const Rounds: React.FC<RoundsProps> = ({ company }) => {
  const [rounds, setRounds] = useState<RoundsType>(defaultRounds);
  const [loading, setLoading] = useState(false);

  // Handle checkbox click
  const handleCheckboxClick = (round: keyof RoundsType, checked: boolean) => {
    setRounds((prevRounds) => ({
      ...prevRounds,
      [round]: checked,
    }));
  };
  
  // New handler for radio group
  const handleRadioChange = (value: string) => {
    setRounds((prevRounds) => ({
      ...prevRounds,
      virtual: value === 'virtual' ? true : null,
      on_campus: value === 'on_campus' ? true : null,
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
    <div className="flex flex-col items-center text-center border-4 border-border p-4 rounded-xl h-fit w-full overflow-auto hide-scroller">
      <h2 className="text-sm">Select the rounds in the drive</h2>
      <p className="text-lg text-red-400">Company Name: {company}</p>

      <div className="grid grid-cols-6 gap-y-3 p-5 gap-x-5 w-full justify-center">
        {/* Radio group for virtual/on_campus */}
        <div className="col-span-6 flex flex-col gap-4">
          <Label className="block justify-center font-bold text-lg">Assessment Type</Label>
          <RadioGroup 
            defaultValue={rounds.virtual ? 'virtual' : rounds.on_campus ? 'on_campus' : ''} 
            onValueChange={handleRadioChange}
          >
            <div className="flex space-x-4 justify-center">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="virtual" id="virtual" />
                <Label htmlFor="virtual" className="font-bold">Virtual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="on_campus" id="on_campus" />
                <Label htmlFor="on_campus" className="font-bold">On Campus</Label>
              </div>
            </div>
          </RadioGroup>
          <p className="mb-4">Select the rounds</p>
        </div>
        
        {/* Other rounds as checkboxes */}
        {Object.keys(rounds).map((round) => (
          (round !== "virtual" && round !== "on_campus") && (
            <label key={round} className="flex items-center gap-2 text-sm">
              <Checkbox
                onCheckedChange={(checked) => handleCheckboxClick(round as keyof RoundsType, checked as boolean)}
              />
              <span className="capitalize">{round === "gd" ? "Group Discussion" : round.replace(/_/g, " ")}</span>
            </label>
          )
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