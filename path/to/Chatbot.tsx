import React from 'react';

interface ChatbotProps {
  usn: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ usn }) => {
  return (
    <div>
      {/* Use the usn prop as needed */}
      <p>Chatbot initialized for USN: {usn}</p>
    </div>
  );
};

export default Chatbot; 