import { createClient } from '@supabase/supabase-js';

const url: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon_key: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const supabase = createClient(url, anon_key);

// Get company rounds
const getCompanyRounds = async (companyId: string) => {
  const { data, error } = await supabase
    .from('company_rounds')
    .select('*')
    .eq('company_id', companyId);

  if (error) {
    console.error("Error fetching company rounds: ", error);
    return null;
  }

  return data;
}

// Update company rounds
const updateCompanyRounds = async (companyId: string, rounds: string[]) => {
  const { data, error } = await supabase
    .from('company_rounds')
    .upsert({ 
      company_id: companyId,
      rounds: rounds 
    });

  if (error) {
    console.error("Error updating company rounds: ", error);
    return false;
  }

  return true;
}

// Get eligible students with round statuses
const getEligibleStudents = async (companyId: string) => {
  const { data, error } = await supabase
    .from('student_rounds')
    .select('*, student_info(*)')
    .eq('company_id', companyId);

  if (error) {
    console.error("Error fetching eligible students: ", error);
    return null;
  }

  return data;
}

// Update student round status
const updateStudentRoundStatus = async (studentId: string, companyId: string, roundUpdates: Record<string, boolean | null>) => {
  const { data, error } = await supabase
    .from('student_rounds')
    .update(roundUpdates)
    .match({ student_id: studentId, company_id: companyId });

  if (error) {
    console.error("Error updating student round status: ", error);
    return false;
  }

  return true;
}

export { getCompanyRounds, updateCompanyRounds, getEligibleStudents, updateStudentRoundStatus };
