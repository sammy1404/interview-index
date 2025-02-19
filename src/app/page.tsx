"use client"

import React, { use, useEffect } from 'react'
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
    <div>
      <Clerk />
    </div>
  )
}

export default page