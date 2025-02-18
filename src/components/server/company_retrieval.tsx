import { createClient } from '@supabase/supabase-js';

const url: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon_key: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";


const supabase = createClient(url, anon_key);

const get_company_details = async (usn: string) => {
  const { data, error } = await supabase
    .from('Company_info')
    .select()
    .eq("usn", usn);

  if (error) {
    console.error("Error fetching students: ", error);
    return null;
  }

  return data;
}


export {
  get_company_details
}
