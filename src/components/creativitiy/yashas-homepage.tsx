import React from 'react'
import "@/components/styles/yashas-homepage.css"
import { TypingAnimation } from "@/components/magicui/typing-animation"
import Clerk from "@/components/ui/Clerk";

const HomePage = () => {
  return (
    <body>
     <div className="container">
        <nav>
            <Clerk />
        </nav>
        <div className="content">
          <h2>Welcome to <span>DriveMetrics</span></h2>
          <TypingAnimation>The key to happiness is to login.</TypingAnimation>
        </div>
      </div> 
    </body>
  )
}

export default HomePage 
