import React, { useState, useRef, useEffect } from 'react';
import { getLegalGuidance } from '../services/geminiService';

const AILegalAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;
    const userQuery = query;
    setQuery('');
    setHistory(prev => [...prev, { role: 'user', text: userQuery }]);
    setLoading(true);

    try {
      const guidance = await getLegalGuidance(userQuery, history);
      setHistory(prev => [...prev, { role: 'ai', text: guidance || 'I am having trouble accessing legal records. Please try again later.' }]);
    } catch (err) {
      setHistory(prev => [...prev, { role: 'ai', text: 'Connection to JusticeStream AI failed. Please check your internet.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-900/40 overflow-hidden flex flex-col h-[650px] border border-slate-800">
      <div className="p-8 bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-950 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
            <i className="fa-solid fa-gavel text-indigo-300 text-xl"></i>
          </div>
          <div>
            <span className="font-black block text-sm tracking-tight">JUSTICE AIDE</span>
            <span className="text-[10px] text-indigo-300 uppercase tracking-widest font-black flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Neural Expert Link
            </span>
          </div>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-900 custom-scrollbar">
        {history.length === 0 && (
          <div className="text-slate-400 text-center mt-12 space-y-8 animate-fadeIn">
            <div className="bg-slate-800/40 p-10 rounded-[2.5rem] border border-slate-800 backdrop-blur-sm">
              <i className="fa-solid fa-book-open-reader text-4xl mb-6 text-indigo-500"></i>
              <p className="text-base font-bold text-white mb-2">How can I assist your case?</p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">I am trained on PCR Act 1955 and PoA Act 1989 legislations.</p>
            </div>
            <div className="grid grid-cols-1 gap-3 px-4">
              {[
                "Who is eligible for SC/ST PoA relief?",
                "Documents needed for grant",
                "How to track FIR status?"
              ].map((q, i) => (
                <button 
                  key={i}
                  onClick={() => setQuery(q)} 
                  className="text-[11px] font-black uppercase tracking-widest bg-slate-800/50 p-4 rounded-2xl hover:bg-slate-800 border border-slate-800 transition-all text-left flex items-center justify-between group"
                >
                  <span className="text-slate-400 group-hover:text-white transition-colors">{q}</span>
                  <i className="fa-solid fa-arrow-right text-indigo-600 text-[10px] group-hover:translate-x-1 transition-transform"></i>
                </button>
              ))}
            </div>
          </div>
        )}
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[85%] p-5 rounded-3xl text-[13px] leading-relaxed font-medium shadow-lg ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-900/20' 
                : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/50 p-5 rounded-3xl border border-slate-800 flex gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900 border-t border-slate-800/50">
        <div className="flex gap-3 bg-slate-800/50 p-2 rounded-3xl border border-slate-800 focus-within:border-indigo-600/50 focus-within:ring-4 focus-within:ring-indigo-600/10 transition-all">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            className="flex-1 bg-transparent border-none outline-none text-white px-5 py-3 text-sm font-medium placeholder:text-slate-600"
            placeholder="Ask anything about the laws..."
          />
          <button 
            onClick={handleSend}
            disabled={loading || !query.trim()}
            className="bg-indigo-600 text-white w-12 h-12 rounded-2xl hover:bg-indigo-500 transition-all flex items-center justify-center disabled:opacity-20 shadow-lg shadow-indigo-900/20"
          >
            <i className="fa-solid fa-paper-plane text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AILegalAssistant;