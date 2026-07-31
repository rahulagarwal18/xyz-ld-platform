import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { Calendar, MapPin, Users, Clock, ChevronRight, Star, AlertCircle, CheckCircle, Target, Zap, Award, BarChart3, MessageSquare, Bot, Palette, Cloud, Rocket, DollarSign, Handshake, Lightbulb, Sparkles } from 'lucide-react';

const MONTH_ICONS = [
  Target,       // Jan: Strategy
  BarChart3,    // Feb: Analytics
  MessageSquare,// Mar: Communication
  Bot,          // Apr: AI
  Award,        // May: Leadership
  Palette,      // Jun: Design Systems
  Cloud,        // Jul: Cloud Architecture
  Rocket,       // Aug: Career Growth
  DollarSign,   // Sep: Financial Acumen
  Handshake,    // Oct: Inclusion & Diversity
  Lightbulb,    // Nov: Innovation Bootcamp
  Sparkles,     // Dec: Year-End Reflection
];

const MONTH_COLORS = [
  { bg: 'var(--n-navy-dark)', accent: 'var(--n-blue)' },       // Jan
  { bg: 'var(--n-navy)', accent: 'var(--n-blue-light)' },      // Feb
  { bg: '#1E1B4B', accent: 'var(--n-blue)' },                 // Mar
  { bg: 'var(--n-navy-dark)', accent: 'var(--n-navy-light)' }, // Apr
  { bg: '#881337', accent: 'var(--n-red)' },                  // May
  { bg: '#064E3B', accent: 'var(--n-success)' },              // Jun
  { bg: '#4C1D95', accent: '#A78BFA' },                       // Jul
  { bg: '#7C2D12', accent: 'var(--n-warning)' },              // Aug
  { bg: '#1E293B', accent: 'var(--n-blue-light)' },           // Sep
  { bg: '#701A75', accent: '#F472B6' },                       // Oct
  { bg: '#065F46', accent: '#34D399' },                       // Nov
  { bg: 'var(--n-navy)', accent: '#FBBF24' },                 // Dec
];

const StatusBadge = ({ conf }) => {
  const full = conf.registeredCount >= conf.totalSeats;
  const pct = Math.round((conf.registeredCount / conf.totalSeats) * 100);

  if (conf.status === 'Completed') return (
    <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 999, background: 'var(--n-success-bg)', color: 'var(--n-success)', fontWeight: 700, border: '1px solid rgba(16,185,129,0.3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <CheckCircle size={10} /> COMPLETED
    </span>
  );
  if (full) return (
    <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 999, background: 'var(--n-error-bg)', color: 'var(--n-red)', fontWeight: 700, border: '1px solid rgba(244,63,94,0.3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <AlertCircle size={10} /> WAITLIST ONLY
    </span>
  );
  if (pct >= 80) return (
    <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 999, background: 'var(--n-warning-bg)', color: 'var(--n-warning)', fontWeight: 700, border: '1px solid rgba(245,158,11,0.3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <Zap size={10} /> FILLING FAST — {100 - pct}% LEFT
    </span>
  );
  return (
    <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 999, background: 'var(--n-blue-pale)', color: 'var(--n-navy)', fontWeight: 700, border: '1px solid rgba(79,70,229,0.3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <CheckCircle size={10} /> OPEN — {conf.totalSeats - conf.registeredCount} SEATS
    </span>
  );
};

export const TLCECalendar = ({ onSelectConference }) => {
  const { conferences, registrations, currentUser } = useLD();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  // Sort by monthIndex
  const sorted = [...conferences].sort((a, b) => a.monthIndex - b.monthIndex);

  const isRegistered = (confId) =>
    registrations.some(r => r.conferenceId === confId && r.userEmail === currentUser?.email);

  const totalLearningHours = conferences.reduce((sum, c) => sum + (c.durationHours || 0) * c.registeredCount, 0);
  const totalPrograms = conferences.length;
  const openPrograms = conferences.filter(c => c.status !== 'Completed' && c.registeredCount < c.totalSeats).length;
  const myEnrollments = registrations.filter(r => r.userEmail === currentUser?.email).length;

  const STATS = [
    { label: 'Total TLCE Programs', value: totalPrograms, icon: Calendar, color: 'var(--n-navy)' },
    { label: 'Open for Registration', value: openPrograms, icon: CheckCircle, color: 'var(--n-success)' },
    { label: 'My Enrollments', value: myEnrollments, icon: Target, color: 'var(--n-blue)' },
    { label: 'Total Learning Hours', value: `${totalLearningHours.toLocaleString()}h`, icon: Clock, color: 'var(--n-red)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        {STATS.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{
              background: 'var(--n-white)', borderRadius: 'var(--radius-lg)', padding: '18px 20px',
              border: '1px solid var(--n-gray-border)', display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-md)',
                background: 'var(--n-gray-light)', border: '1px solid var(--n-gray-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Icon size={22} color={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: 'var(--n-gray-mid)', fontWeight: 600, marginTop: 2 }}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Calendar Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Calendar size={22} color="var(--n-navy)" />
        <h2 style={{ fontSize: 22, color: 'var(--n-navy-dark)', fontWeight: 800, margin: 0 }}>TLCE Annual Calendar — 2026</h2>
        <span style={{
          fontSize: 11, padding: '4px 12px', borderRadius: 999,
          background: 'var(--n-blue-pale)', color: 'var(--n-navy)', fontWeight: 700, border: '1px solid rgba(79,70,229,0.3)'
        }}>12 Programs · Full Year</span>
      </div>

      {/* Monthly Grid */}
      <div className="tlce-calendar-grid">
        {sorted.map((conf) => {
          const colors = MONTH_COLORS[conf.monthIndex] || MONTH_COLORS[0];
          const Icon = MONTH_ICONS[conf.monthIndex] || Target;
          const registered = isRegistered(conf.id);
          const full = conf.registeredCount >= conf.totalSeats;
          const pct = Math.round((conf.registeredCount / conf.totalSeats) * 100);

          return (
            <div
              key={conf.id}
              className="calendar-month-card"
              onMouseEnter={() => setHoveredId(conf.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => conf.status !== 'Completed' && onSelectConference(conf)}
              style={{ cursor: conf.status === 'Completed' ? 'default' : 'pointer', opacity: conf.status === 'Completed' ? 0.85 : 1 }}
            >
              {/* Month Header */}
              <div className="month-header" style={{ background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.accent} 100%)` }}>
                <div>
                  <div style={{ fontSize: 11, opacity: 0.85, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700 }}>
                    {conf.month} 2026
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4, lineHeight: 1.25, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={16} /> {conf.title}
                  </div>
                </div>
                {registered && (
                  <span style={{
                    background: 'rgba(255,255,255,0.25)', borderRadius: 999,
                    padding: '4px 10px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
                    display: 'inline-flex', alignItems: 'center', gap: 4
                  }}><CheckCircle size={12} /> Enrolled</span>
                )}
              </div>

              {/* Month Body */}
              <div className="month-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Highlight */}
                <p style={{ fontSize: 12, color: 'var(--n-gray-mid)', lineHeight: 1.5, fontStyle: 'italic' }}>
                  "{conf.monthlyHighlight}"
                </p>

                {/* Meta */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--n-gray-dark)', alignItems: 'center' }}>
                    <Calendar size={12} color="var(--n-navy)" />
                    <span style={{ fontWeight: 600 }}>{conf.date}</span>
                    <span style={{ color: 'var(--n-gray-mid)' }}>·</span>
                    <Clock size={12} color="var(--n-gray-mid)" />
                    <span style={{ color: 'var(--n-gray-mid)' }}>{conf.durationHours}h</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--n-gray-mid)', alignItems: 'center' }}>
                    <Users size={12} />
                    <span>{conf.registeredCount}/{conf.totalSeats} registered</span>
                  </div>
                </div>

                {/* Seat Progress */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${pct}%`,
                        background: full ? 'var(--n-red)' : pct >= 80 ? 'var(--n-warning)' : 'var(--n-blue)'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                    <StatusBadge conf={conf} />
                  </div>
                </div>

                {/* CTA */}
                {conf.status !== 'Completed' && (
                  <button
                    className={`btn ${registered ? 'btn-outline-blue' : full ? 'btn-danger' : 'btn-primary'} btn-sm`}
                    style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
                    onClick={(e) => { e.stopPropagation(); onSelectConference(conf); }}
                  >
                    {registered ? 'View Details' : full ? 'Join Waitlist' : 'Register Now'}
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
