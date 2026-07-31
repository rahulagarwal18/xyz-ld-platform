import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { Calendar, MapPin, Users, Clock, ChevronRight, AlertCircle, CheckCircle, Target, Zap, Award, BarChart3, MessageSquare, Bot, Palette, Cloud, Rocket, DollarSign, Handshake, Lightbulb, Sparkles, Quote } from 'lucide-react';

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

const ACCENT_COLORS = [
  '#4F46E5', // Jan: Indigo
  '#0EA5E9', // Feb: Sky Blue
  '#8B5CF6', // Mar: Purple
  '#6366F1', // Apr: Tech Blue
  '#F43F5E', // May: Rose
  '#10B981', // Jun: Emerald
  '#3B82F6', // Jul: Cloud Blue
  '#F59E0B', // Aug: Amber
  '#0284C7', // Sep: Finance Teal
  '#D946EF', // Oct: Inclusion Magenta
  '#059669', // Nov: Innovation Green
  '#EAB308', // Dec: Gold
];

const StatusBadge = ({ conf }) => {
  const full = conf.registeredCount >= conf.totalSeats;
  const pct = Math.round((conf.registeredCount / conf.totalSeats) * 100);

  if (conf.status === 'Completed') return (
    <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 999, background: 'rgba(16,185,129,0.1)', color: '#059669', fontWeight: 700, border: '1px solid rgba(16,185,129,0.25)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <CheckCircle size={12} /> Completed
    </span>
  );
  if (full) return (
    <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 999, background: 'rgba(244,63,94,0.1)', color: '#E11D48', fontWeight: 700, border: '1px solid rgba(244,63,94,0.25)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <AlertCircle size={12} /> Waitlist Only
    </span>
  );
  if (pct >= 80) return (
    <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 999, background: 'rgba(245,158,11,0.1)', color: '#D97706', fontWeight: 700, border: '1px solid rgba(245,158,11,0.25)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <Zap size={12} /> Filling Fast — {100 - pct}% Left
    </span>
  );
  return (
    <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 999, background: 'rgba(79,70,229,0.08)', color: '#4F46E5', fontWeight: 700, border: '1px solid rgba(79,70,229,0.2)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <CheckCircle size={12} /> Open — {conf.totalSeats - conf.registeredCount} Seats
    </span>
  );
};

export const TLCECalendar = ({ onSelectConference }) => {
  const { conferences, registrations, currentUser } = useLD();
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
    { label: 'Total TLCE Programs', value: totalPrograms, icon: Calendar, color: '#4F46E5', bg: 'rgba(79,70,229,0.08)' },
    { label: 'Open for Registration', value: openPrograms, icon: CheckCircle, color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
    { label: 'My Enrollments', value: myEnrollments, icon: Target, color: '#0EA5E9', bg: 'rgba(14,165,233,0.08)' },
    { label: 'Total Learning Hours', value: `${totalLearningHours.toLocaleString()}h`, icon: Clock, color: '#F43F5E', bg: 'rgba(244,63,94,0.08)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* ── Top Executive Metric Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {STATS.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{
              background: '#ffffff', borderRadius: 16, padding: '20px',
              border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16,
              boxShadow: '0 4px 14px rgba(11,15,25,0.03)', transition: 'all 0.2s ease'
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: stat.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Icon size={24} color={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#0B0F19', lineHeight: 1.1 }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 4 }}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Section Title ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={20} color="#4F46E5" />
          </div>
          <div>
            <h2 style={{ fontSize: 22, color: '#0B0F19', fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>
              TLCE Annual Calendar — 2026
            </h2>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500, marginTop: 2 }}>
              12 Flagship Learning &amp; Leadership Programs Across 2026
            </div>
          </div>
        </div>
        <span style={{
          fontSize: 12, padding: '6px 14px', borderRadius: 999,
          background: '#EEF2FF', color: '#4F46E5', fontWeight: 700, border: '1px solid rgba(79,70,229,0.2)'
        }}>12 Programs · Full Year</span>
      </div>

      {/* ── Executive 12-Month Calendar Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {sorted.map((conf) => {
          const accent = ACCENT_COLORS[conf.monthIndex] || '#4F46E5';
          const Icon = MONTH_ICONS[conf.monthIndex] || Target;
          const registered = isRegistered(conf.id);
          const full = conf.registeredCount >= conf.totalSeats;
          const pct = Math.round((conf.registeredCount / conf.totalSeats) * 100);
          const isHovered = hoveredId === conf.id;

          return (
            <div
              key={conf.id}
              onMouseEnter={() => setHoveredId(conf.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => conf.status !== 'Completed' && onSelectConference(conf)}
              style={{
                background: '#ffffff',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                borderTop: `4px solid ${accent}`,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: isHovered ? '0 12px 28px rgba(79,70,229,0.12)' : '0 4px 14px rgba(11,15,25,0.03)',
                transform: isHovered ? 'translateY(-3px)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: conf.status === 'Completed' ? 'default' : 'pointer',
                opacity: conf.status === 'Completed' ? 0.9 : 1
              }}
            >
              {/* Card Padding Wrapper */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>

                {/* ── Top Header Row: Month Badge + Enrolled Tag ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 12px', borderRadius: 999,
                    background: `${accent}12`, border: `1px solid ${accent}30`,
                    color: accent, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8
                  }}>
                    <Icon size={13} /> {conf.month} 2026
                  </div>

                  {registered && (
                    <span style={{
                      background: 'rgba(16,185,129,0.1)', color: '#059669',
                      borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 800,
                      border: '1px solid rgba(16,185,129,0.25)',
                      display: 'inline-flex', alignItems: 'center', gap: 4
                    }}>
                      <CheckCircle size={12} /> Enrolled
                    </span>
                  )}
                </div>

                {/* ── Title & Subtitle ── */}
                <div>
                  <h3 style={{
                    fontSize: 16, fontWeight: 800, color: '#0B0F19',
                    margin: 0, lineHeight: 1.3, letterSpacing: '-0.2px'
                  }}>
                    {conf.title}
                  </h3>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: 500, lineHeight: 1.4 }}>
                    {conf.subtitle}
                  </div>
                </div>

                {/* ── Executive Highlight Box (Replaces Serif Italic) ── */}
                <div style={{
                  background: '#F8FAFC',
                  borderLeft: `3px solid ${accent}`,
                  borderRadius: '0 8px 8px 0',
                  padding: '10px 12px',
                  fontSize: 12, color: '#334155', lineHeight: 1.5, fontWeight: 500
                }}>
                  "{conf.monthlyHighlight}"
                </div>

                {/* ── Program Metadata Badges ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 'auto', paddingTop: 4 }}>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#475569', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600 }}>
                      <Calendar size={13} color={accent} /> {conf.date}
                    </span>
                    <span style={{ color: '#CBD5E1' }}>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748B' }}>
                      <Clock size={13} /> {conf.durationHours}h Session
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748B' }}>
                    <Users size={13} />
                    <span style={{ fontWeight: 600, color: '#334155' }}>{conf.registeredCount}</span> / {conf.totalSeats} seats filled
                  </div>
                </div>

                {/* ── Progress Bar & Status ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{
                    height: 6, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%', width: `${pct}%`,
                      background: full ? '#F43F5E' : pct >= 80 ? '#F59E0B' : accent,
                      borderRadius: 999, transition: 'width 0.5s ease'
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <StatusBadge conf={conf} />
                  </div>
                </div>

                {/* ── CTA Button ── */}
                {conf.status !== 'Completed' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectConference(conf); }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: 10,
                      border: 'none',
                      background: registered ? '#EEF2FF' : full ? '#F43F5E' : accent,
                      color: registered ? '#4F46E5' : '#ffffff',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      marginTop: 4,
                      boxShadow: registered ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {registered ? 'View Registration' : full ? 'Join Waitlist' : 'Register Now'}
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
