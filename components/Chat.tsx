import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';

interface ChatProps {
  messages: Message[];
}

export const Chat: React.FC<ChatProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col gap-6">
      {messages.map((msg, idx) => {
        const isBot = msg.role === 'model';
        return (
          <div key={idx} className={`flex gap-4 ${isBot ? '' : 'flex-row-reverse'}`}>
            {/* Avatar */}
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              isBot ? 'bg-yellow-500 text-slate-900' : 'bg-slate-700 text-white'
            }`}>
              {isBot ? <Bot size={18} /> : <User size={18} />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              isBot 
                ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700' 
                : 'bg-blue-600 text-white rounded-tr-none'
            }`}>
              {msg.text}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};
