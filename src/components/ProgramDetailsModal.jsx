import React from 'react';
import { X, Calendar, Clock, MapPin, Users, Award, Utensils, ClipboardList, CheckCircle, Zap, ArrowRight, UserCheck, BookOpen, Target, ShieldCheck } from 'lucide-react';
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

  const fallbackDesc = `${conference.title} is an intensive flagship program curated by xyz Learning & Development. This session empowers teams with practical frameworks, strategic tools, and actionable insights to excel in enterprise workflows.`;

  return (
    <div
      className="modal-backdrop"
      style={{ zIndex: 1000, background: 'rgba(0, 32, 91, 0.65)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-container" style={{ maxWidth: 620, animation: 'modalSlide 0.25s ease' }}>

        {/* ── Modal Header ── */}
        <div className="modal-header" style={{ position: 'relative', padding: '24px 28px' }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(255,255,255,0.18)', border: 'none',
              borderRadius: 8, color: '#fff', cursor: 'pointer',
              padding: 6, display: 'flex', lineHeight: 0
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999,
              background: 'var(--n-blue)', color: '#fff', textTransform: 'uppercase', letterSpacing: 0.8
            }}>
              {conference.category}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
              background: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(4px)'
            }}>
              {conference.bannerTag || 'TLCE 2026'}
            </span>
          </div>

          <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: 0, paddingRight: 36, lineHeight: 1.25 }}>
            {conference.title}
          </h3>
          <p style={{ opacity: 0.85, fontSize: 13, marginTop: 6, margin: '6px 0 0', fontWeight: 500 }}>
            {conference.subtitle}
          </p>

          {/* Event Quick Strip */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Calendar size={13} color="var(--n-blue-light)" /> {conference.date}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Clock size={13} color="var(--n-blue-light)" /> {conference.time} ({conference.durationHours}h)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <MapPin size={13} color="var(--n-blue-light)" /> {conference.location}
            </span>
          </div>
        </div>

        {/* ── Modal Body Content ── */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Program Overview / Description */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--n-navy-dark)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              <BookOpen size={16} color="var(--n-navy)" /> Program Overview &amp; Description
            </h4>
            <div style={{
              background: 'var(--n-gray-light)', padding: '16px 18px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--n-gray-border)', fontSize: 14, color: 'var(--n-gray-dark)',
              lineHeight: 1.6, fontWeight: 500
            }}>
              {conference.description || fallbackDesc}
            </div>
          </div>

          {/* Key Objective Highlight */}
          {conference.monthlyHighlight && (
            <div style={{
              background: 'var(--n-blue-pale)', borderLeft: '4px solid var(--n-navy)',
              borderRadius: '0 var(--radius-md) var(--radius-md) 0', padding: '12px 16px',
              fontSize: 13, color: 'var(--n-navy-dark)', lineHeight: 1.5, fontWeight: 600
            }}>
              🎯 <strong>Learning Outcome:</strong> {conference.monthlyHighlight}
            </div>
          )}

          {/* Keynote Speaker Bio */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--n-navy-dark)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              <UserCheck size={16} color="var(--n-navy)" /> Keynote Speaker
            </h4>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14, background: 'var(--n-white)',
              padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--n-gray-border)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', background: 'var(--grad-navy)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18,
                flexShrink: 0
              }}>
                {conference.speaker ? conference.speaker[0] : 'S'}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--n-navy-dark)' }}>{conference.speaker}</div>
                <div style={{ fontSize: 12, color: 'var(--n-gray-mid)', fontWeight: 500, marginTop: 2 }}>
                  Senior Subject Matter Expert · xyz L&amp;D Faculty
                </div>
              </div>
            </div>
          </div>

          {/* Target Audience & Logistics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            <div>
              <h5 style={{ fontSize: 12, fontWeight: 800, color: 'var(--n-navy)', marginBottom: 6, textTransform: 'uppercase' }}>
                Target Audience
              </h5>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(conference.targetAudience || ['All Employees']).map(aud => (
                  <span key={aud} className="badge badge-blue" style={{ fontSize: 11 }}>{aud}</span>
                ))}
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: 12, fontWeight: 800, color: 'var(--n-navy)', marginBottom: 6, textTransform: 'uppercase' }}>
                Inclusions &amp; Logistics
              </h5>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {conference.hasMeal && <span className="badge badge-green" style={{ fontSize: 11 }}><Utensils size={11} /> Meal Included</span>}
                {conference.hasAssessment && <span className="badge badge-navy" style={{ fontSize: 11 }}><ClipboardList size={11} /> Assessment</span>}
                <span className="badge badge-gray" style={{ fontSize: 11 }}><Users size={11} /> {conference.registeredCount}/{conference.totalSeats} Enrolled</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Modal Footer Actions ── */}
        <div style={{
          padding: '16px 28px', borderTop: '1px solid var(--n-gray-border)', background: 'var(--n-gray-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          borderRadius: '0 0 var(--radius-xl) var(--radius-xl)'
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--n-gray-mid)', fontWeight: 600, textTransform: 'uppercase' }}>Seat Availability</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: isFull ? 'var(--n-red)' : 'var(--n-success)' }}>
              {isFull ? '● Full Capacity (Waitlist)' : `● ${seatsLeft} Seats Remaining (${pct}% filled)`}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onClose}
              className="btn btn-secondary btn-sm"
            >
              Close
            </button>

            {conference.status !== 'Completed' && (
              <button
                onClick={() => { onClose(); onRegister(conference); }}
                className={`btn ${isRegistered ? 'btn-success' : isFull ? 'btn-danger' : 'btn-primary'} btn-md`}
                style={{ fontWeight: 800 }}
              >
                {isRegistered ? 'View Registration' : isFull ? 'Join Waitlist' : 'Register Now'}
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
