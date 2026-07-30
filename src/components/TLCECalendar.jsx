import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { Calendar, MapPin, Users, Clock, ChevronRight, Star, AlertCircle, CheckCircle } from 'lucide-react';

const MONTH_ICONS = ['🎯','📊','🗣️','🤖','🏆','🎨','☁️','🚀','💰','🤝','💡','🎊'];
const MONTH_COLORS = [
  { bg: '#00205B', accent: '#009CDE' }, // Jan
  { bg: '#1a3a6b', accent: '#33B5E8' }, // Feb
  { bg: '#003087', accent: '#009CDE' }, // Mar
  { bg: '#004B8D', accent: '#33B5E8' }, // Apr
  { bg: '#CC0000', accent: '#FF4444' }, // May
  { bg: '#006B3C', accent: '#2DB37D' }, // Jun
  { bg: '#7B2D8B', accent: '#BC5FD0' }, // Jul
  { bg: '#8B4500', accent: '#FF8C00' }, // Aug
  { bg: '#1a5276', accent: '#2E86C1' }, // Sep
  { bg: '#6B2D00', accent: '#E67E22' }, // Oct
  { bg: '#1B5E20', accent: '#43A047' }, // Nov
  { bg: '#003087', accent: '#F4C430' }, // Dec
];

const StatusBadge = ({ conf }) => {
  const full = conf.registeredCount >= conf.totalSeats;
  const pct = Math.round((conf.registeredCount / conf.totalSeats) * 100);

  if (conf.status === 'Completed') return (
    <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 999, background: 'rgba(46,125,50,0.2)', color: '#2E7D32', fontWeight: 700, border: '1px solid rgba(46,125,50,0.4)' }}>
      ✓ COMPLETED
    </span>
  );
  if (full) return (
    <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 999, background: 'rgba(204,0,0,0.15)', color: '#CC0000', fontWeight: 700, border: '1px solid rgba(204,0,0,0.3)' }}>
      ● WAITLIST ONLY
    </span>
  );
  if (pct >= 80) return (
    <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 999, background: 'rgba(245,127,23,0.15)', color: '#F57F17', fontWeight: 700, border: '1px solid rgba(245,127,23,0.3)' }}>
      ⚡ FILLING FAST — {100 - pct}% LEFT
    </span>
  );
  return (
    <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 999, background: 'rgba(0,156,222,0.15)', color: '#003087', fontWeight: 700, border: '1px solid rgba(0,156,222,0.3)' }}>
      ● OPEN — {conf.totalSeats - conf.registeredCount} SEATS
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        {[
          { label: 'Total TLCE Programs', value: totalPrograms, icon: '📅', color: 'var(--n-navy)' },
          { label: 'Open for Registration', value: openPrograms, icon: '✅', color: 'var(--n-success)' },
          { label: 'My Enrollments', value: myEnrollments, icon: '🎯', color: 'var(--n-blue)' },
          { label: 'Total Learning Hours', value: `${totalLearningHours.toLocaleString()}h`, icon: '⏱️', color: 'var(--n-red)' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--n-white)', borderRadius: 'var(--radius-lg)', padding: '18px 20px',
            border: '1px solid var(--n-gray-border)', display: 'flex', alignItems: 'center', gap: 14
          }}>
            <span style={{ fontSize: 28 }}>{stat.icon}</span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'var(--n-gray-mid)', fontWeight: 600, marginTop: 2 }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Calendar size={22} color="var(--n-navy)" />
        <h2 style={{ fontSize: 22, color: 'var(--n-navy-dark)' }}>TLCE Annual Calendar — 2026</h2>
        <span style={{
          fontSize: 11, padding: '4px 12px', borderRadius: 999,
          background: 'var(--n-blue-pale)', color: 'var(--n-navy)', fontWeight: 700, border: '1px solid rgba(0,156,222,0.3)'
        }}>12 Programs · Full Year</span>
      </div>

      {/* Monthly Grid */}
      <div className="tlce-calendar-grid">
        {sorted.map((conf, idx) => {
          const colors = MONTH_COLORS[conf.monthIndex] || MONTH_COLORS[0];
          const icon = MONTH_ICONS[conf.monthIndex] || '📌';
          const registered = isRegistered(conf.id);
          const full = conf.registeredCount >= conf.totalSeats;
          const pct = Math.round((conf.registeredCount / conf.totalSeats) * 100);
          const isHovered = hoveredId === conf.id;

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
                  <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>
                    {conf.month} 2026
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, marginTop: 2, lineHeight: 1.2 }}>
                    {icon} {conf.title}
                  </div>
                </div>
                {registered && (
                  <span style={{
                    background: 'rgba(255,255,255,0.25)', borderRadius: 999,
                    padding: '4px 10px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap'
                  }}>✓ Enrolled</span>
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
                        background: pct >= 100 ? 'var(--n-red)'
                          : pct >= 80 ? 'var(--n-warning)'
                          : `linear-gradient(90deg, ${colors.bg}, ${colors.accent})`
                      }}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
                  <StatusBadge conf={conf} />
                  {conf.hasMeal && (
                    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, background: 'rgba(46,125,50,0.1)', color: 'var(--n-success)', fontWeight: 600, border: '1px solid rgba(46,125,50,0.3)' }}>
                      🍽️ MEAL
                    </span>
                  )}
                  {conf.hasAssessment && (
                    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, background: 'var(--n-blue-pale)', color: 'var(--n-navy)', fontWeight: 600, border: '1px solid rgba(0,156,222,0.3)' }}>
                      📝 ASSESSMENT
                    </span>
                  )}
                </div>

                {/* CTA */}
                {conf.status !== 'Completed' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectConference(conf); }}
                    style={{
                      marginTop: 4, padding: '9px 0', borderRadius: 'var(--radius-md)',
                      background: registered ? 'var(--n-success-bg)' : full ? 'rgba(204,0,0,0.08)' : 'var(--grad-navy)',
                      color: registered ? 'var(--n-success)' : full ? 'var(--n-red)' : '#fff',
                      border: registered ? '1.5px solid var(--n-success)' : full ? '1.5px solid var(--n-red)' : 'none',
                      fontWeight: 700, fontSize: 13, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      transition: 'all 0.2s ease',
                      transform: isHovered && !registered ? 'translateY(-1px)' : 'none',
                      boxShadow: isHovered && !registered ? 'var(--shadow-md)' : 'none'
                    }}
                  >
                    {registered ? '✓ View Registration' : full ? '+ Join Waitlist' : 'Register Now →'}
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
