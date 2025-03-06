"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Check, Cross, Arrow } from "../../../public/svg/components";
import "../styles/interview_display.css";
import { get_interview_stats } from "../server/interview_retrieval";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Filter = {
  eligibility: string | null;
  applied: string | null;
  shortlisted: string | null;
  attended: string | null;
};

type Props = {
  usn: string;
  companyName: string;
  filters: Filter;
};

const url: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon_key: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabase = createClient(url, anon_key);

export default function Interview_display({
  usn,
  filters,
  companyName,
}: Props) {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const [companyNames, setCompanyNames] = useState<string[]>([]);
  const [ineligibleCompanies, setIneligibleCompanies] = useState<string[]>([]);

  useEffect(() => {
    const get_details = async () => {
      const data = await get_interview_stats(usn);
      if (data) {
        setStudents(data);
      }
    };
    get_details();
  }, [usn]);

  useEffect(() => {
    const update_filtered_list = async () => {
      const filtered_list = students.filter((student: any) => {
        return (
          Object.entries(filters).every(([key, value]) => {
            if (value === null) return true;
            return student[key] === (value === "true" ? true : false);
          }) &&
          (!companyName ||
            student.company_name
              ?.toLowerCase()
              .includes(companyName?.toLowerCase()))
        );
      });
      setFilteredList(filtered_list);
    };

    const return_company_names = async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("company_name");
      if (error) {
        console.error("Error fetching company names:", error);
      } else if (data) {
        const allCompanyNames = data.map((company) => company.company_name);
        setCompanyNames(allCompanyNames);

        // Find companies the student is NOT eligible for
        const eligibleCompanyNames = new Set(
          filteredList.map((student) => student.company_name)
        );
        const ineligible = allCompanyNames.filter(
          (name) => !eligibleCompanyNames.has(name)
        );
        setIneligibleCompanies(ineligible);
      }
    };

    update_filtered_list();
    return_company_names();
  }, [filters, students, companyName]);

  return (
    <div className="interview-container">
      <div className="interview-stats">
        {/* Render companies the student is eligible for */}
        {filteredList.map((student, index) => (
          <div key={index} className="company-container">
            <div className="main-info">
              <h1>{student.company_name}</h1>
              <div className="criteria-container">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <p className="round">
                        {student.eligibility ? <Check /> : <Cross />}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Eligibility</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <p className="round">
                        {student.applied ? <Check /> : <Cross />}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Applied</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <p className="round">
                        {student.shortlisted ? <Check /> : <Cross />}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Short Listed</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <p className="round">
                        {student.attended ? <Check /> : <Cross />}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Attended</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            {student.eligibility && (
              <div className="interview_rounds hide-scroller">
                {[
                  { key: "resume_screening", label: "Resume Screening" },
                  { key: "virtual", label: "Virtual" },
                  { key: "on_campus", label: "On-Campus" },
                  { key: "aptitude", label: "Aptitude" },
                  { key: "technical_mcq", label: "Technical MCQ" },
                  { key: "coding_1", label: "Coding: 1" },
                  { key: "gd", label: "GD" },
                  { key: "coding_2", label: "Coding: 2" },
                  {
                    key: "technical_interview_1",
                    label: "Technical Interview: 1",
                  },
                  {
                    key: "technical_interview_2",
                    label: "Technical Interview: 2",
                  },
                  { key: "assignment", label: "Assignment" },
                  { key: "managerial_round", label: "Managerial Round" },
                  { key: "hr_round", label: "HR Round" },
                  { key: "placed", label: "Placed" },
                ].map(({ key, label }) => (
                  <p key={key} className="round">
                    {label}{" "}
                    {student[key] === true ? (
                      <Arrow />
                    ) : student[key] === false ? (
                      <Cross />
                    ) : null}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Render companies the student is NOT eligible for */}
        {ineligibleCompanies.length > 0 &&
          students.length > 0 &&
          ineligibleCompanies.map((name, index) => (
            <div key={index} className="company-container">
              <div className="h-full">
                <div className="main-info">
                  <div>
                    <h1>{name}</h1>
                  </div>
                  <div className="justify-center"></div>
                </div>
                <div className="round translate-y-[4rem] text-xl">
                  NOT ELIGIBLE
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
