import React, { useState, useRef, useEffect } from 'react';
import { useLD } from '../context/LDContext';
import { Bot, Send, Key, X, User } from 'lucide-react';

export const GroqAIChat = ({ isOpen, onClose }) => {
  const { conferences, groqApiKey, setGroqApiKey, currentUser } = useLD();

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hello ${currentUser.name}! I am the xyz L&D AI Assistant powered by Groq. Ask me any question about upcoming conferences, meal preferences, shuttle cab pickup points, or career progression tracks at xyz.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(groqApiKey);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const saveApiKey = (e) => {
    e.preventDefault();
    setGroqApiKey(tempApiKey.trim());
    setShowKeyModal(false);
  };

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

    const systemPrompt = `You are the official AI Assistant for "xyz Learning and Devlopemnt department".
Your job is to assist employees with conference inquiries, seat availability, cab pick-up points, meal options, and career progression recommendations.

Here is the current live list of conferences at xyz:
${confSummary}

Cab Pickup Points Available: City Tech Park Shuttle Station, Main HQ Tower A, North Metro Gate 2 Hub, East Business Bay.
Meal Options: Veg, Non-Veg, Vegan, Jain, Gluten-Free, No Preference.`;

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

    // Smart Fallback AI logic
    setTimeout(() => {
      let botReply = '';
      const q = userQuery.toLowerCase();

      if (q.includes('banner') || q.includes('ai ready') || q.includes('leading') || q.includes('career')) {
        botReply = `We have 3 flagship featured conferences currently open:\n1. **AI Ready Mindset** (Aug 15) - Enterprise GenAI\n2. **Leading at xyz** (Aug 22) - Managerial Excellence\n3. **Career at xyz** (Sep 05) - Career Paths & Mentorship\n\nYou can select any banner on the top carousel to register with meal & cab preferences!`;
      } else if (q.includes('cab') || q.includes('shuttle') || q.includes('transport')) {
        botReply = `Yes! We offer complimentary shuttle cabs for all xyz conferences. You can request a cab during registration. Pickup locations include:\n- City Tech Park Shuttle Station\n- Main HQ Tower A Plaza\n- North Metro Gate 2 Hub\n- Airport Express Terminal`;
      } else if (q.includes('meal') || q.includes('food') || q.includes('veg') || q.includes('vegan')) {
        botReply = `All conference registrations include complimentary catering. Available meal options:\n- Veg 🥗\n- Non-Veg 🍗\n- Vegan 🌿\n- Jain 🍲\n- Gluten-Free 🌾\n- No Preference 🍴`;
      } else if (q.includes('seat') || q.includes('capacity') || q.includes('fast')) {
        const fastConfs = conferences.filter(c => c.registeredCount >= c.totalSeats * 0.75).map(c => c.title).join(', ');
        botReply = `Seats are filling fast! Conferences currently at over 75% capacity: ${fastConfs}. We recommend booking early on the dashboard!`;
      } else {
        botReply = `Thank you for reaching out to the xyz Learning and Devlopemnt department! You can register for any upcoming event, view headcount metrics, or request cab/meal options directly on this portal. Is there a specific topic you'd like to explore?`;
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#00132e]/50 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#001e42] text-white">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-[#0066cc] text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                Groq AI L&D Assistant
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#00a3e0]/20 text-[#00a3e0] border border-[#00a3e0]/40">
                  {groqApiKey ? 'API ACTIVE' : 'FALLBACK MODE'}
                </span>
              </h3>
              <p className="text-[11px] font-semibold text-slate-300">
                xyz Learning and Devlopemnt department
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowKeyModal(true)}
              className="p-1.5 rounded bg-[#00132e] hover:bg-[#002d62] text-amber-400 border border-slate-700 transition-all text-xs flex items-center gap-1 font-bold"
              title="Configure Groq API Key"
            >
              <Key className="w-3.5 h-3.5" />
            </button>

            <button onClick={onClose} className="p-1.5 rounded bg-[#00132e] text-slate-300 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stream */}
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
            <div className="text-xs text-[#0066cc] font-extrabold p-2">Groq AI is processing your answer...</div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
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

        {/* Key Modal */}
        {showKeyModal && (
          <div className="absolute inset-0 z-50 bg-[#00132e]/60 p-6 flex items-center justify-center">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-[#001e42] text-sm flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-600" /> Configure Groq API Key
                </h4>
                <button onClick={() => setShowKeyModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 font-medium">
                Enter your official Groq AI Key (starts with <code className="text-amber-800 font-mono font-extrabold">gsk_...</code>). If left empty, the platform uses built-in smart L&D response logic.
              </p>

              <form onSubmit={saveApiKey} className="space-y-3">
                <input
                  type="password"
                  placeholder="gsk_..."
                  value={tempApiKey}
                  onChange={e => setTempApiKey(e.target.value)}
                  className="input-nielsen text-xs font-mono"
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowKeyModal(false)} className="btn-nielsen-secondary text-xs">
                    Cancel
                  </button>
                  <button type="submit" className="btn-nielsen-primary text-xs">
                    Save Key
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
