import React, { useState, useRef, useEffect } from 'react';
import { useLD } from '../context/LDContext';
import { Send, X, Bot, ChevronDown, Minimize2 } from 'lucide-react';

const FAQ_CHIPS = [
  'Which programs are open?',
  'How do I register?',
  'Is meal included?',
  'Cab pickup options?',
  'What is assessment?',
  'Check my enrollment',
];

export const ChatBot = () => {
  const { conferences, groqApiKey, currentUser } = useLD();

  const [isOpen, setIsOpen]     = useState(false);
  const [messages, setMessages] = useState([{
    sender: 'bot',
    text: `Hello ${currentUser?.name?.split(' ')[0] || 'there'} 👋\nHow may I help you today?`,
    isWelcome: true
  }]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const chatEndRef               = useRef(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [messages, loading, isOpen]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const updated = [...messages, { sender: 'user', text: userText }];
    setMessages(updated);
    setLoading(true);

    const confSummary = conferences.map(c =>
      `"${c.title}" | ${c.date} | Seats left: ${c.totalSeats - c.registeredCount}/${c.totalSeats} | Meal: ${c.hasMeal ? 'Yes' : 'No'}`
    ).join('\n');

    const systemPrompt = `You are the official AI Assistant for xyz Learning & Development Department TLCE LMS.
Be professional, concise and friendly. Do NOT mention Groq, Llama, or any AI model names.
Help with: program details, registration, seat availability, cab/shuttle pickup, meals, assessments.
Shuttle pickup options: City Tech Park, Main HQ Tower A, North Metro Gate 2, East Business Bay.
Meal options: Veg or Non-Veg (only on meal-included events).
TLCE Programs:\n${confSummary}`;

    if (groqApiKey) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqApiKey}` },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              ...updated.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }))
            ],
            temperature: 0.6, max_tokens: 320
          })
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(prev => [...prev, { sender: 'bot', text: data.choices[0]?.message?.content || 'I could not process that. Please try again.' }]);
          setLoading(false);
          return;
        }
      } catch (e) { console.error(e); }
    }

    // Smart local fallback
    setTimeout(() => {
      const q = userText.toLowerCase();
      let reply = 'I can help you with TLCE program registration, seat availability, meal choices, and shuttle cab bookings. What would you like to know?';
      if (q.includes('open') || q.includes('available'))
        reply = `Currently open programs:\n${conferences.filter(c => c.registeredCount < c.totalSeats && c.status !== 'Completed').map(c => `• ${c.title} — ${c.totalSeats - c.registeredCount} seats left`).slice(0, 4).join('\n')}`;
      else if (q.includes('register'))
        reply = 'To register, click any program card and select "Register Now". You can choose your meal preference and shuttle cab option during registration.';
      else if (q.includes('meal') || q.includes('food'))
        reply = 'Meal is included only in select events (marked with a 🍽️ tag). Options are Veg or Non-Veg — chosen at registration.';
      else if (q.includes('cab') || q.includes('shuttle'))
        reply = 'Shuttle pickups are available from:\n• City Tech Park Shuttle Station\n• Main HQ Tower A Plaza\n• North Metro Gate 2 Hub\n• East Business Bay Pickup Point\nSelect your slot during registration.';
      else if (q.includes('assessment'))
        reply = 'Some programs include Pre & Post assessments. They are conducted in fullscreen mode. You can access them from your program card after registering.';
      else if (q.includes('enroll') || q.includes('my'))
        reply = 'You can view your enrollments on the TLCE Programs page — enrolled programs show a green "✓ Registered" badge.';
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setLoading(false);
    }, 450);
  };

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(); };

  return (
    <>
      {/* ── Floating Launcher Button ── */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9000 }}>

        {/* Popup window */}
        {isOpen && (
          <div style={{
            position: 'absolute', bottom: 64, right: 0,
            width: 360, height: 500,
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 12px 48px rgba(0,32,91,0.28), 0 2px 12px rgba(0,0,0,0.12)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            animation: 'popUp 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            transformOrigin: 'bottom right',
            border: '1px solid rgba(0,48,135,0.1)'
          }}>
            <style>{`
              @keyframes popUp {
                from { opacity: 0; transform: scale(0.85) translateY(12px); }
                to   { opacity: 1; transform: scale(1) translateY(0); }
              }
              @keyframes bounceDot {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-5px); }
              }
            `}</style>

            {/* ── Header ── */}
            <div style={{
              background: 'linear-gradient(135deg, #00205B 0%, #003087 55%, #0056A2 100%)',
              padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
              flexShrink: 0
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(255,255,255,0.18)',
                border: '1.5px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Bot size={18} color="#fff" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, color: '#fff', fontSize: 13, lineHeight: 1 }}>
                  xyz L&amp;D Assistant
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
                  Online · Here to help
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  width: 28, height: 28, borderRadius: 8, border: 'none',
                  background: 'rgba(255,255,255,0.14)', color: '#fff',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <ChevronDown size={16} />
              </button>
            </div>

            {/* ── Messages ── */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '14px 14px 8px',
              display: 'flex', flexDirection: 'column', gap: 10,
              background: '#F7F9FC'
            }}>
              {messages.map((msg, i) => (
                <div key={i}>
                  {msg.isWelcome ? (
                    /* Welcome bubble */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                          background: '#00205B', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Bot size={13} color="#009CDE" />
                        </div>
                        <div style={{
                          background: '#fff', border: '1px solid #E2E8F0',
                          padding: '10px 14px', borderRadius: '4px 16px 16px 16px',
                          fontSize: 13, color: '#1E293B', fontWeight: 500,
                          lineHeight: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                        }}>
                          {msg.text}
                        </div>
                      </div>

                      {/* FAQ Chips */}
                      <div style={{ paddingLeft: 34, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {FAQ_CHIPS.map(faq => (
                          <button
                            key={faq}
                            onClick={() => sendMessage(faq)}
                            style={{
                              padding: '5px 11px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                              border: '1.5px solid #BFDBFE',
                              background: '#EFF6FF', color: '#1D4ED8',
                              cursor: 'pointer', transition: 'all 0.15s ease',
                              lineHeight: 1.4
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#1D4ED8'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = '#1D4ED8'; }}
                          >
                            {faq}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Normal message */
                    <div style={{
                      display: 'flex',
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-end', gap: 7
                    }}>
                      {msg.sender === 'bot' && (
                        <div style={{
                          width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                          background: '#00205B', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Bot size={13} color="#009CDE" />
                        </div>
                      )}
                      <div style={{
                        maxWidth: '80%', padding: '9px 13px',
                        borderRadius: msg.sender === 'user' ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
                        background: msg.sender === 'user'
                          ? 'linear-gradient(135deg, #003087, #009CDE)'
                          : '#fff',
                        color: msg.sender === 'user' ? '#fff' : '#1E293B',
                        fontSize: 13, lineHeight: 1.55, fontWeight: 500,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                        border: msg.sender === 'bot' ? '1px solid #E2E8F0' : 'none',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing dots */}
              {loading && (
                <div style={{ display: 'flex', gap: 7, alignItems: 'flex-end' }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                    background: '#00205B', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Bot size={13} color="#009CDE" />
                  </div>
                  <div style={{
                    background: '#fff', border: '1px solid #E2E8F0',
                    padding: '10px 14px', borderRadius: '4px 14px 14px 14px',
                    display: 'flex', gap: 5, alignItems: 'center',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                  }}>
                    {[0, 180, 360].map(d => (
                      <span key={d} style={{
                        width: 6, height: 6, borderRadius: '50%', background: '#94A3B8',
                        display: 'inline-block',
                        animation: `bounceDot 1.2s ease ${d}ms infinite`
                      }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* ── Input ── */}
            <form onSubmit={handleSubmit} style={{
              padding: '10px 12px',
              borderTop: '1px solid #E8EDF3',
              background: '#fff',
              display: 'flex', gap: 8, alignItems: 'center',
              flexShrink: 0
            }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your question..."
                style={{
                  flex: 1, padding: '9px 13px', borderRadius: 12,
                  border: '1.5px solid #E2E8F0', outline: 'none',
                  fontSize: 13, fontFamily: 'inherit', color: '#1E293B',
                  background: '#F8FAFC', transition: 'border-color 0.2s ease'
                }}
                onFocus={e => e.target.style.borderColor = '#003087'}
                onBlur={e => e.target.style.borderColor = '#E2E8F0'}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                style={{
                  width: 38, height: 38, borderRadius: 11, border: 'none', flexShrink: 0,
                  background: input.trim() && !loading ? 'linear-gradient(135deg,#003087,#009CDE)' : '#F1F5F9',
                  color: input.trim() && !loading ? '#fff' : '#94A3B8',
                  cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        )}

        {/* ── Launcher Button ── */}
        <button
          onClick={() => setIsOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '11px 18px', borderRadius: 999, border: 'none',
            background: isOpen
              ? 'linear-gradient(135deg, #00205B, #003087)'
              : 'linear-gradient(135deg, #003087 0%, #009CDE 100%)',
            color: '#fff', fontWeight: 800, fontSize: 13,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,48,135,0.45)',
            transition: 'all 0.2s ease',
            letterSpacing: 0.2
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,48,135,0.55)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,48,135,0.45)'; }}
        >
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            {isOpen ? <ChevronDown size={13} color="#fff" /> : <Bot size={13} color="#fff" />}
          </div>
          <span>L&amp;D Assistant</span>
          {!isOpen && (
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#4ADE80', flexShrink: 0,
              boxShadow: '0 0 0 3px rgba(74,222,128,0.25)'
            }} />
          )}
        </button>
      </div>
    </>
  );
};
