'use client'

import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="grid w-full h-[100vh] items-center bg-zinc-100 px-4 sm:justify-center">
      <SignIn appearance={{
        elements: {
          formButtonPrimary: 'bg-zinc-950 hover:bg-zinc-800',
          card: 'bg-white shadow-md rounded-2xl',
        }
      }} />
    </div>
  )
}
