import { createClient } from '@supabase/supabase-js';

const url = 'https://hrcmqezcdkbmxgdfxxqo.supabase.co';
const anon_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyY21xZXpjZGtibXhnZGZ4eHFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NTcwMTUsImV4cCI6MjA1NTQzMzAxNX0.vylGgJ5oJadZfTT5w_c816EIPCtp1Zpppe2PSu42qTw';


const supabase = createClient(url, anon_key);

export default async function get_student_details() {
  const { data, error } = await supabase
    .from('Company_info')
    .select();

  if (error) {
    console.error("Error fetching students: ", error);
    return null;
  }

  return data;
}


