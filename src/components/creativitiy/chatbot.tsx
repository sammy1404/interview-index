import React from 'react'
import "../styles/chatbot.css"

import { Button } from "@/components/ui/button"
import { useState } from "react"


export default function Chatbot() {

  const [isOpen, setOpen] = useState(false)


  return (
    <div className='chatbot-container'>
      <Button variant="default">Open Chat</Button>
    </div>
  )
}

