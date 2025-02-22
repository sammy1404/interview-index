import React from 'react'
import "@/components/styles/yashas-homepage.css"
import { TypingAnimation } from "@/components/magicui/typing-animation"

const HomePage = () => {
  return (
    <body>
     <div className="container">
        <nav>
            <button id="loginBtn" className="login-button">Login</button>
        </nav>
        <div className="content">
          <h2>Welcome to <span>Drive Metrics</span></h2>
          <TypingAnimation>The key to happiness is to login.</TypingAnimation>
        </div>
      </div> 
    </body>
  )
}

export default HomePage 
