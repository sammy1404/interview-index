import React from 'react'

import { Button } from "@/components/ui/button"
import { useState } from "react"
import ReactMarkdown from "react-markdown";

type BotResponseType = {
  response: string;
}

export default function Chatbot() {
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [botResponse, setBotResponse] = useState<BotResponseType | null>(null);
  const [isLoading, setLoading] = useState<Boolean>(false);

  const fetchResponse = async() => {
    setLoading(true);
    try {
      const response = await fetch("/api/rag", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify( { query } ),
      });

      const data: BotResponseType = await response.json();
      setBotResponse(data);
      setLoading(false);
    }
    catch (error) {
      console.error("Error fetching data: ", error);
    }

  }

  return (
    <>
      <div className={`flex justify-center items-center flex-col gap-5 fixed top-0 right-2 h-screen bg-background
      border-l-4 border-black shadow-lg transition-all duration-300 
      ease-in-out ${isOpen ? "w-[40vw]" : "w-0 overflow-hidden translate-x-10"}`}>
        <div className="w-[30vw] h-[50vh] p-2 border-4 border-black rounded-md bg-white transition-all duration-300 overflow-scroll">
          {botResponse? Object.entries(botResponse).map(([company, message]) => (
            <div key={company} className='mb-2 p-2 border rounded-sm'>
              <h3 className="font-bold">{company}</h3>
              <ReactMarkdown>
                {isLoading ? "Loading..." : message}
              </ReactMarkdown>
            </div>
          )): ""}
        </div>
        <input className="w-[30vw] h-[5vh] pl-2 border-4 border-black rounded-md transition-all duration-300" type="text" placeholder="Enter your question"  onChange={(e) => {setQuery(e.target.value)}}/>
        <Button onClick={fetchResponse}>Send</Button>
      </div>
      <Button className="fixed w-50 z-10 bottom-2 right-2" variant="default" onClick={() => setOpen(!isOpen)}>Open Chat</Button>
    </>
  )
}

