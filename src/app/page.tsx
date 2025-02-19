"use client"

import React, { useEffect } from 'react'
import Clerk from "@/components/ui/Clerk";
import { useAuth } from '@clerk/clerk-react';

const page = () => {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      window.location.href = '/admin';
    }
  }, [isSignedIn]);

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl md:text-8xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text'>Interview Index</h1>
      <Clerk />
    </div>
  )
}

export default page