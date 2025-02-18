"use client"

import Student_display from '../components/creativitiy/student_display'

export default function Home() {
  return (
    <div className='pl-10 pr-10 pt-5'>
      <h1 className='text-3xl font-bold mb-5 text-center md:text-6xl'>Interview Index</h1>
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center items-center">
        <div className="w-full md:w-[350px] h-[50vh] md:h-[80vh] rounded-lg" style={{ backgroundColor: 'var(--primary)'}}>
          <Student_display />
        </div>

        <div className="flex flex-col w-full md:w-[650px] h-auto md:h-[80vh] gap-6 md:gap-10 p-5 border-4 rounded-lg" style={{ borderColor: 'var(--primary)' }}>
          <div className="w-full h-[40vh] md:flex-grow rounded-lg" style={{ backgroundColor: 'var(--primary)'}}>
          </div>
          <div className="w-full h-[40vh] md:flex-grow rounded-lg" style={{ backgroundColor: 'var(--primary)'}}>   
          </div>
        </div>
      </div>
    </div>
  );
}
