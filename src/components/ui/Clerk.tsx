import React from 'react'
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'
import "@/components/styles/yashas-homepage.css"


const Clerk = () => {
  return (
    <div>
        <SignedOut>
            <SignInButton>
            <button id="loginBtn" className="login-button">Log in</button>
            </SignInButton>
        </SignedOut>
        <SignedIn>
            <UserButton />
        </SignedIn>
    </div>
  )
}

export default Clerk