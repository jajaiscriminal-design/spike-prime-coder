import React from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeViewerProps {
  code: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ code }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!code) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4 p-8 text-center">
        <div className="w-16 h-16 rounded-xl bg-slate-800/50 border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-600">
            <span className="font-mono text-2xl">{'</>'}</span>
        </div>
        <p className="max-w-xs">Code will appear here after you describe your task to the assistant.</p>
      </div>
    );
  }

  return (
    <div className="relative h-full group">
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 z-10 p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-lg flex items-center gap-2 text-xs"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? 'Copied' : 'Copy Code'}
      </button>
      <div className="h-full overflow-auto p-6 bg-[#1e1e1e]">
        <pre className="font-mono text-sm leading-6">
            <code className="text-[#d4d4d4] whitespace-pre-wrap">
                {/* Simple syntax highlighting simulation logic for display */}
                {code.split('\n').map((line, i) => (
                   <Line key={i} content={line} />
                ))}
            </code>
        </pre>
      </div>
    </div>
  );
};

// Basic syntax highlighting component
const Line: React.FC<{ content: string }> = ({ content }) => {
    // Very basic heuristic highlighting
    const formatLine = (text: string) => {
        // Comments
        if (text.trim().startsWith('#')) {
            return <span className="text-[#6a9955]">{text}</span>;
        }
        
        const parts = text.split(/(\s+)/);
        return parts.map((part, idx) => {
             // Keywords
            if (['import', 'from', 'def', 'async', 'await', 'return', 'if', 'else', 'elif', 'while', 'for', 'in', 'True', 'False', 'global'].includes(part.trim())) {
                return <span key={idx} className="text-[#c586c0]">{part}</span>;
            }
            // Numbers
            if (/^\d+$/.test(part.trim())) {
                 return <span key={idx} className="text-[#b5cea8]">{part}</span>;
            }
            // Strings
            if (part.startsWith("'") || part.startsWith('"')) {
                 return <span key={idx} className="text-[#ce9178]">{part}</span>;
            }
            // Function calls (heuristic)
            if (/\w+\(/.test(part)) {
                 const name = part.split('(')[0];
                 const rest = part.substring(name.length);
                 return <span key={idx}><span className="text-[#dcdcaa]">{name}</span>{rest}</span>;
            }
            
            return <span key={idx}>{part}</span>;
        });
    }

    return <div className="min-h-[1.5em]">{formatLine(content)}</div>;
}
