"use client"

import HomePage from "@/components/creativitiy/yashas-homepage"
import React, {useEffect } from 'react'
// import Clerk from "@/components/ui/Clerk";
import { useAuth } from '@clerk/clerk-react';

const Page = () => {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      window.location.href = '/admin';
    }
  }, [isSignedIn]);

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <HomePage />
      {/* <Clerk /> */}
    </div>
  )
}

export default Page
