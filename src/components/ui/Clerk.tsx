import React from 'react'
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'


const Clerk = () => {
  return (
    <>
        <SignedOut>
            <SignInButton />
        </SignedOut>
        <SignedIn>
            <UserButton />
        </SignedIn>
    </>
  )
}

export default Clerk