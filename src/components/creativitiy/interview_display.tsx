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
        console.log(ineligibleCompanies)
        // console.log(allCompanyNames)
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
            <>
              {student.eligibility ? (
                <div className="interview_rounds hide-scroller">
                <>
                  {student.resume_screening === true ? (
                    <p className="round">
                      Resume Screening <Arrow />
                    </p>
                  ) : student.resume_screening === false ? (
                    <p className="round">
                      Resume Screening <Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.virtual === true ? (
                    <p className="round">
                      Virtual <Arrow />
                    </p>
                  ) : student.virtual === false ? (
                    <p className="round">
                      Virtual <Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.on_campus === true ? (
                    <p className="round">
                      On-Campus <Arrow />
                    </p>
                  ) : student.on_campus === false ? (
                    <p className="round">
                      On-Campus <Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.aptitude === true ? (
                    <p className="round">
                      Aptitude <Arrow />
                    </p>
                  ) : student.aptitude === false ? (
                    <p className="round">
                      Aptitude <Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.technical_mcq === true ? (
                    <p className="round">
                      Technical MCQ<Arrow />
                    </p>
                  ) : student.technical_mcq === false ? (
                    <p className="round">
                      Technical MCQ<Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.coding_1 === true ? (
                    <p className="round">
                      Coding: 1<Arrow />
                    </p>
                  ) : student.coding_1 === false ? (
                    <p className="round">
                      Coding: 1<Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.gd === true ? (
                    <p className="round">
                      GD <Arrow />
                    </p>
                  ) : student.gd === false ? (
                    <p className="round">
                      GD <Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.coding_2 === true ? (
                    <p className="round">
                      Coding: 2<Arrow />
                    </p>
                  ) : student.coding_2 === false ? (
                    <p className="round">
                      Coding: 2<Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.technical_interview_1 === true ? (
                    <p className="round">
                      Technical Interview: 1 <Arrow />
                    </p>
                  ) : student.technical_interview_1 === false ? (
                    <p className="round">
                      Technical Interview: 1 <Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.technical_interview_2 === true ? (
                    <p className="round">
                      Technical Interview: 2 <Arrow />
                    </p>
                  ) : student.technical_interview_2 === false ? (
                    <p className="round">
                      Technical Interview: 2 <Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.assignment === true ? (
                    <p className="round">
                      Assignment <Arrow />
                    </p>
                  ) : student.assignment === false ? (
                    <p className="round">
                      Assignment <Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.managerial_round === true ? (
                    <p className="round">
                      Managerial Round <Arrow />
                    </p>
                  ) : student.managerial_round === false ? (
                    <p className="round">
                      Managerial Round <Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.hr_round === true ? (
                    <p className="round">
                      HR Round <Arrow />
                    </p>
                  ) : student.hr_round === false ? (
                    <p className="round">
                      HR Round <Cross />
                    </p>
                  ) : null}
                </>
                <>
                  {student.placed === true ? (
                    <p className="round">
                      Placed <Arrow />
                    </p>
                  ) : student.placed === false ? (
                    <p className="round">
                      Placed <Cross />
                    </p>
                  ) : null}
                </>
              </div>
              ) : null}
              </>
          </div>
        ))}

        {/* Render companies the student is NOT eligible for */}
        {ineligibleCompanies.length > 0 && filters.eligibility=="false" && filters.applied !=="true"&&
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
