import React from 'react';
import { X, Calendar, Clock, MapPin, Users, Award, Utensils, Car, ClipboardList, CheckCircle, Zap, Shield, ArrowRight, UserCheck } from 'lucide-react';
import { useLD } from '../context/LDContext';

export const ProgramDetailsModal = ({ conference, onClose, onRegister }) => {
  if (!conference) return null;
  const { registrations, currentUser } = useLD();

  const isRegistered = registrations.some(
    r => r.conferenceId === conference.id && r.userEmail === currentUser?.email
  );
  const seatsLeft = conference.totalSeats - conference.registeredCount;
  const isFull = seatsLeft <= 0;
  const pct = Math.round((conference.registeredCount / conference.totalSeats) * 100);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16
    }} onClick={onClose}>
      <div style={{
        background: '#ffffff', borderRadius: 24,
        maxWidth: 680, width: '100%', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)', overflow: 'hidden',
        animation: 'modalSlide 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }} onClick={e => e.stopPropagation()}>

        {/* ── Header Banner ── */}
        <div style={{
          position: 'relative', height: 200, overflow: 'hidden', background: '#0F172A'
        }}>
          <img
            src={conference.image}
            alt={conference.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.4) 100%)' }} />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16, zIndex: 10,
              width: 36, height: 36, borderRadius: '50%', border: 'none',
              background: 'rgba(15,23,42,0.6)', color: '#ffffff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)'
            }}
          >
            <X size={18} />
          </button>

          {/* Banner Title Details */}
          <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24, color: '#ffffff' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 999,
                background: '#4F46E5', color: '#ffffff'
              }}>
                {conference.category}
              </span>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999,
                background: 'rgba(255,255,255,0.2)', color: '#ffffff', backdropFilter: 'blur(4px)'
              }}>
                {conference.bannerTag || 'TLCE Program'}
              </span>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', margin: 0, lineHeight: 1.25, letterSpacing: '-0.3px' }}>
              {conference.title}
            </h2>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4, fontWeight: 500 }}>
              {conference.subtitle}
            </div>
          </div>
        </div>

        {/* ── Scrollable Body Content ── */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Quick Info Grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12,
            background: '#F8FAFC', padding: 16, borderRadius: 16, border: '1px solid #E2E8F0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Calendar size={18} color="#4F46E5" />
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Date</div>
                <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 700 }}>{conference.date}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Clock size={18} color="#0EA5E9" />
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Timing &amp; Duration</div>
                <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 700 }}>{conference.time} ({conference.durationHours}h)</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MapPin size={18} color="#10B981" />
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Venue / Stream</div>
                <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 700 }}>{conference.location}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Users size={18} color="#F43F5E" />
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Seat Capacity</div>
                <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 700 }}>{conference.registeredCount}/{conference.totalSeats} Registered ({pct}%)</div>
              </div>
            </div>
          </div>

          {/* Program Overview & Description */}
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Award size={16} color="#4F46E5" /> About This TLCE Event
            </h3>
            <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              {conference.description}
            </p>
          </div>

          {/* Highlight Summary */}
          {conference.monthlyHighlight && (
            <div style={{
              background: '#EEF2FF', borderLeft: '4px solid #4F46E5', borderRadius: '0 12px 12px 0',
              padding: '12px 16px', fontSize: 13, color: '#3730A3', lineHeight: 1.5, fontWeight: 600
            }}>
              💡 <strong>Key takeaway:</strong> {conference.monthlyHighlight}
            </div>
          )}

          {/* Keynote Speaker */}
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <UserCheck size={16} color="#4F46E5" /> Featured Keynote Speaker
            </h3>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, background: '#F8FAFC',
              padding: '12px 16px', borderRadius: 12, border: '1px solid #E2E8F0'
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%', background: '#4F46E5', color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16
              }}>
                {conference.speaker ? conference.speaker[0] : 'S'}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>{conference.speaker}</div>
                <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Leading Speaker &amp; Subject Matter Expert</div>
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Target Audience</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(conference.targetAudience || []).map(aud => (
                <span key={aud} style={{
                  fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 999,
                  background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1'
                }}>
                  {aud}
                </span>
              ))}
            </div>
          </div>

          {/* Event Perks & Logistics */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {conference.hasMeal && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#10B981', fontWeight: 700, background: '#ECFDF5', padding: '6px 12px', borderRadius: 8, border: '1px solid #A7F3D0' }}>
                <Utensils size={14} /> Complimentary Meal Provided
              </div>
            )}
            {conference.hasAssessment && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4F46E5', fontWeight: 700, background: '#EEF2FF', padding: '6px 12px', borderRadius: 8, border: '1px solid #C7D2FE' }}>
                <ClipboardList size={14} /> Includes Pre &amp; Post Assessment
              </div>
            )}
          </div>

        </div>

        {/* ── Footer CTA ── */}
        <div style={{
          padding: '16px 28px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
        }}>
          <div>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Registration Status</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: full ? '#F43F5E' : '#10B981' }}>
              {full ? 'Fully Booked (Waitlist Open)' : `${seatsLeft} Seats Available`}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 18px', borderRadius: 10, border: '1px solid #CBD5E1',
                background: '#ffffff', color: '#475569', fontWeight: 700, fontSize: 13, cursor: 'pointer'
              }}
            >
              Close
            </button>

            {conference.status !== 'Completed' && (
              <button
                onClick={() => { onClose(); onRegister(conference); }}
                style={{
                  padding: '10px 22px', borderRadius: 10, border: 'none',
                  background: isRegistered ? '#10B981' : full ? '#F43F5E' : '#4F46E5',
                  color: '#ffffff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 14px rgba(79,70,229,0.3)'
                }}
              >
                {isRegistered ? 'View Registration' : full ? 'Join Waitlist' : 'Register Now'}
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
