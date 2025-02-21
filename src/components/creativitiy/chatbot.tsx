import React from 'react'
import "../styles/chatbot.css"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"



export default function Chatbot() {

  return (
    <div className='chatbot-container'>
       <Sheet>
        <SheetTrigger>
          <Button>Open</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Chat with me and find out more about yourself</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
   </div>
  )
}

