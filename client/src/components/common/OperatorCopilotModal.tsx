import React, { useState } from 'react';
import { useUBIP } from '../../context/UBIPContext';
import { Sparkles, X, Send, Bot, User, CheckCircle2, ShieldCheck } from 'lucide-react';

export const OperatorCopilotModal: React.FC = () => {
  const { isCopilotOpen, setIsCopilotOpen } = useUBIP();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; citations?: any[] }[]>([
    {
      role: 'assistant',
      text: 'Hello Operator. I am the UBIP-X AI Copilot. I analyze real-time physical telemetry, blockchain provenance blocks, and AI anomaly reasoning traces directly from the local trust engine. How can I assist you?',
      citations: [
        { details: 'Connected to UBIP-X In-Memory Trust Engine & Local Hardhat Ledger.' }
      ]
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isCopilotOpen) return null;

  const handleSend = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim() || isLoading) return;

    const userMsg = { role: 'user' as const, text: q };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/copilot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      }).then(r => r.json());

      if (res.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: res.answer.response,
          citations: res.answer.evidenceCitations
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Error connecting to local copilot service. Please ensure the UBIP-X backend is running.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'What is the current status of ASSET-001?',
    'What happens when data tampering is detected?',
    'Explain the blockchain provenance record.',
    'How do the 9 sector adapters work?'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-ubip-850 border border-ubip-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] font-mono text-xs">
        {/* Header */}
        <div className="p-4 border-b border-ubip-700/60 bg-ubip-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">UBIP-X Operator Copilot</div>
              <div className="text-[10px] text-slate-400">Grounded in actual physical & blockchain evidence</div>
            </div>
          </div>

          <button
            onClick={() => setIsCopilotOpen(false)}
            className="p-1.5 rounded-lg hover:bg-ubip-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[80%] p-3.5 rounded-xl space-y-2 ${
                m.role === 'user'
                  ? 'bg-ubip-accent/20 border border-ubip-accent/40 text-slate-100'
                  : 'bg-ubip-900 border border-ubip-700/60 text-slate-200'
              }`}>
                <p className="leading-relaxed">{m.text}</p>

                {m.citations && m.citations.length > 0 && (
                  <div className="pt-2 border-t border-ubip-700/40 space-y-1 text-[10px] text-slate-400">
                    <span className="text-ubip-accent uppercase font-bold">System Evidence Citations:</span>
                    {m.citations.map((c, ci) => (
                      <div key={ci} className="text-slate-300">
                        • {c.details}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-ubip-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-xl bg-ubip-900 border border-ubip-700 text-slate-400">
                Analyzing real-time evidence...
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-ubip-900/60 border-t border-ubip-700/40 flex flex-wrap gap-1.5 overflow-x-auto">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-lg bg-ubip-800 hover:bg-ubip-700 text-slate-300 hover:text-white text-[10px] border border-ubip-700/60 transition-colors whitespace-nowrap"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-ubip-900 border-t border-ubip-700/60 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask anything about physical telemetry, blockchain hashes, or active incidents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            className="flex-1 px-3 py-2 rounded-xl bg-ubip-850 border border-ubip-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ubip-accent"
          />
          <button
            onClick={() => handleSend()}
            disabled={!query.trim() || isLoading}
            className="p-2.5 rounded-xl bg-ubip-accent text-black font-bold hover:bg-cyan-400 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
