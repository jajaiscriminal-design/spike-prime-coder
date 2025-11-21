import React, { useState, useRef, useEffect } from 'react';
import { Chat } from './components/Chat';
import { CodeViewer } from './components/CodeViewer';
import { generateSpikeCode } from './services/gemini';
import { Message, SpikeCodeResponse } from './types';
import { Loader2, Cpu, BookOpen } from 'lucide-react';

const INITIAL_PROMPT = "My motors are plugged into C, D and E respectively, could you write something that makes it move forward at say 250 so relatviely slow, and make it spin 360 degrees after it detects an object 15cm ahead";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I'm your LEGO SPIKE Prime coding assistant. I know the Python API inside out. How can I help you program your robot today?"
    }
  ]);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Suggest the prompt from the user's request if it's the first interaction
  const [suggestedPrompt, setSuggestedPrompt] = useState<string | null>(INITIAL_PROMPT);

  const handleSendMessage = async (text: string) => {
    setIsLoading(true);
    setError(null);
    setSuggestedPrompt(null); // Clear suggestion once used

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text }]);

    try {
      const result: SpikeCodeResponse = await generateSpikeCode(text, generatedCode);
      
      setMessages(prev => [...prev, { role: 'model', text: result.explanation }]);
      if (result.code) {
        setGeneratedCode(result.code);
      }
    } catch (err) {
      setError("Failed to generate code. Please try again.");
      setMessages(prev => [...prev, { role: 'model', text: "I encountered an error while processing your request. Please check your API key or try again." }]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-slate-700 bg-slate-800/50 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 p-2 rounded-lg text-slate-900">
            <Cpu size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">SPIKE <span className="text-yellow-400">Prime</span> Coder</h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <BookOpen size={16} />
            <span>API Context Loaded</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Chat */}
        <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col border-r border-slate-700 bg-slate-900/50">
          <div className="flex-1 overflow-y-auto p-4">
             <Chat messages={messages} />
             {isLoading && (
               <div className="flex items-center gap-2 text-slate-400 mt-4 ml-2 animate-pulse">
                 <Loader2 size={16} className="animate-spin" />
                 <span>Analyzing documentation & generating code...</span>
               </div>
             )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-700 bg-slate-800/30">
            {suggestedPrompt && (
              <button 
                onClick={() => handleSendMessage(suggestedPrompt)}
                className="mb-4 text-xs text-left bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 p-3 rounded-lg w-full transition-colors flex flex-col gap-1"
              >
                <span className="font-semibold uppercase tracking-wider text-[10px] text-yellow-500">Suggested Task</span>
                "{suggestedPrompt}"
              </button>
            )}
            <InputBox onSend={handleSendMessage} disabled={isLoading} />
          </div>
        </div>

        {/* Right Panel: Code Viewer */}
        <div className="hidden md:flex w-1/2 lg:w-7/12 flex-col bg-[#1e1e1e]">
          <div className="h-10 bg-[#252526] flex items-center px-4 border-b border-[#3e3e42] justify-between">
            <span className="text-xs text-slate-300 font-mono">main.py</span>
            <span className="text-xs text-slate-500">MicroPython</span>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <CodeViewer code={generatedCode} />
          </div>
        </div>
      </main>
    </div>
  );
}

interface InputBoxProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe what you want the robot to do..."
        className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pl-4 pr-12 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-yellow-400 text-slate-900 rounded-lg hover:bg-yellow-300 disabled:opacity-50 disabled:hover:bg-yellow-400 transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </svg>
      </button>
    </form>
  );
};
