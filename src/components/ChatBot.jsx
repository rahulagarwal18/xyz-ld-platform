import React, { useState, useRef, useEffect } from 'react';
import { useLD } from '../context/LDContext';
import { MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';

export const ChatBot = () => {
  const { conferences, groqApiKey, currentUser } = useLD();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hello ${currentUser.name}! I am your AI Chat Assistant powered by Groq Llama 3.3. Ask me anything about upcoming conferences, seats, shuttle cabs, or meal choices!`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    setInput('');

    const updatedMessages = [...messages, { sender: 'user', text: userQuery }];
    setMessages(updatedMessages);
    setLoading(true);

    const confSummary = conferences.map(c => 
      `Title: "${c.title}", Category: ${c.category}, Date: ${c.date}, Time: ${c.time}, Location: ${c.location}, Seats Left: ${c.totalSeats - c.registeredCount}/${c.totalSeats}, Target: ${c.targetAudience.join(', ')}`
    ).join('\n');

    const systemPrompt = `You are the official AI Chatbot Assistant for "xyz Learning and Devlopemnt department".
Your job is to assist employees with conference inquiries, seat availability, cab pick-up points, meal options, and career progression recommendations.

Live Conferences List at xyz:
${confSummary}

Cab Pickup Points Available: City Tech Park Shuttle Station, Main HQ Tower A, North Metro Gate 2 Hub, East Business Bay.
Meal Options: Veg, Non-Veg, Vegan, Jain, Gluten-Free, No Preference.`;

    // Real Call to Groq API using pre-filled key
    if (groqApiKey) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqApiKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              ...updatedMessages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
              }))
            ],
            temperature: 0.7,
            max_tokens: 450
          })
        });

        if (response.ok) {
          const data = await response.json();
          const botReply = data.choices[0]?.message?.content || 'I apologize, I could not process your query.';
          setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Groq API error:', err);
      }
    }

    // Fallback if network issue
    setTimeout(() => {
      let botReply = `Thank you for reaching out to xyz Learning and Devlopemnt department! You can register for any upcoming event, view headcount metrics, or request cab/meal options directly on this portal.`;
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
      setLoading(false);
    }, 400);
  };

  return (
    <>
      {/* Floating Bottom-Right Chatbot Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0066cc] text-white font-extrabold text-xs shadow-xl hover:bg-[#0052a3] transition-all hover:scale-105 border border-white/20"
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
          <span>L&D Chat Assistant</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
        </button>
      </div>

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#00132e]/40 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#001e42] text-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#0066cc] text-white">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                    xyz L&D Chat Assistant <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-400/30">GROQ ONLINE</span>
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-300">
                    Learning and Devlopemnt department
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 rounded bg-[#00132e] text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-[#001e42] flex items-center justify-center text-[#00a3e0] font-bold shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3 rounded-xl ${
                      m.sender === 'user'
                        ? 'bg-[#0066cc] text-white rounded-br-none font-semibold shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none whitespace-pre-line shadow-xs font-medium'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="text-xs text-[#0066cc] font-extrabold p-2 flex items-center gap-2">
                  <span className="animate-pulse">Groq AI Llama 3.3 is thinking...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about conferences, cab pickup, meals..."
                value={input}
                onChange={e => setInput(e.target.value)}
                className="input-nielsen text-xs !py-2 flex-1"
              />
              <button type="submit" disabled={!input.trim() || loading} className="btn-nielsen-primary !p-2 text-xs rounded-lg">
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
};
