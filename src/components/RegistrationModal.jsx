import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { X, Utensils, Car, Send, Users, Clock, MapPin, AlertTriangle, List, CheckCircle } from 'lucide-react';

// ── Clean Toggle Switch (no double-fire bug) ────────────────────────────────
const ToggleSwitch = ({ checked, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    style={{
      position: 'relative',
      width: 48, height: 26, borderRadius: 999,
      background: checked ? 'var(--n-blue)' : '#CBD5E1',
      cursor: 'pointer',
      transition: 'background 0.25s ease',
      flexShrink: 0,
      boxShadow: checked ? '0 0 0 3px rgba(0,156,222,0.2)' : 'none'
    }}
    role="switch"
    aria-checked={checked}
    tabIndex={0}
    onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onChange(!checked); } }}
  >
    <span style={{
      position: 'absolute',
      top: 3,
      left: checked ? 25 : 3,
      width: 20, height: 20,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
      transition: 'left 0.25s ease'
    }} />
  </div>
);

export const RegistrationModal = ({ conference, onClose }) => {
  const { currentUser, registerForConference, addToWaitlist, registrations } = useLD();

  const [userName, setUserName]               = useState(currentUser.name);
  const [userEmail, setUserEmail]             = useState(currentUser.email);
  const [department]                          = useState(currentUser.department || 'Engineering');
  const [mealPreference, setMealPreference]   = useState('Veg');
  const [needCab, setNeedCab]                 = useState(false);
  const [cabPickupLocation, setCabPickupLocation] = useState('City Tech Park Shuttle Station');
  const [cabPickupSlot, setCabPickupSlot]     = useState('09:15 AM Batch');
  const [submitting, setSubmitting]           = useState(false);
  const [joinedWaitlist, setJoinedWaitlist]   = useState(false);

  if (!conference) return null;

  const isFull           = conference.registeredCount >= conference.totalSeats;
  const seatsLeft        = conference.totalSeats - conference.registeredCount;
  const pct              = Math.round((conference.registeredCount / conference.totalSeats) * 100);
  const alreadyRegistered = registrations.some(r => r.conferenceId === conference.id && r.userEmail === currentUser.email);
  const onWaitlist       = (conference.waitlist || []).some(w => w.email === currentUser.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = registerForConference({
      conferenceId: conference.id,
      userInfo: { id: currentUser.id, name: userName, email: userEmail, department },
      mealPreference: conference.hasMeal ? mealPreference : null,
      needCab, cabPickupLocation, cabPickupSlot
    });
    setSubmitting(false);
    if (res.success) onClose();
  };

  const handleWaitlist = () => {
    addToWaitlist({ conferenceId: conference.id, userInfo: { name: userName, email: userEmail } });
    setJoinedWaitlist(true);
  };

  const CAB_LOCATIONS = [
    'City Tech Park Shuttle Station',
    'Main HQ Tower A Plaza',
    'North Metro Gate 2 Hub',
    'East Business Bay Pickup Point',
    'Airport Express Terminal'
  ];
  const CAB_SLOTS = [
    '08:30 AM Batch',
    '09:15 AM Batch',
    '10:00 AM Batch',
    '01:15 PM Batch'
  ];

  // ── Shared card style ──────────────────────────────────────────────────────
  const sectionCard = {
    background: 'var(--n-gray-light)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--n-gray-border)',
    overflow: 'hidden'
  };

  return (
    <div
      className="modal-backdrop"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-container" style={{ maxWidth: 560 }}>

        {/* ── Modal Header ── */}
        <div className="modal-header" style={{ position: 'relative' }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 14, right: 14,
              background: 'rgba(255,255,255,0.18)', border: 'none',
              borderRadius: 8, color: '#fff', cursor: 'pointer',
              padding: 6, display: 'flex', lineHeight: 0
            }}
          >
            <X size={16} />
          </button>

          <div style={{ fontSize: 10, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>
            TLCE Program Registration
          </div>
          <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: 0, paddingRight: 36, lineHeight: 1.2 }}>
            {conference.title}
          </h3>
          <p style={{ opacity: 0.7, fontSize: 12, marginTop: 4 }}>
            xyz Learning and Development Department
          </p>

          {/* Event meta strip */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 14 }}>
            {[
              { Icon: Clock,  text: conference.time },
              { Icon: MapPin, text: conference.location },
              { Icon: Users,  text: `${conference.registeredCount}/${conference.totalSeats} registered` },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(255,255,255,0.78)', fontWeight: 500 }}>
                <Icon size={11} /> {text}
              </div>
            ))}
          </div>
        </div>

        {/* ── Already Registered ── */}
        {alreadyRegistered ? (
          <div className="modal-body">
            <div style={{
              background: 'var(--n-success-bg)', border: '1.5px solid var(--n-success)',
              borderRadius: 'var(--radius-md)', padding: '18px 20px',
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              <CheckCircle size={28} color="var(--n-success)" />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--n-success)', fontSize: 15 }}>You're Already Registered!</div>
                <div style={{ fontSize: 13, color: 'var(--n-gray-mid)', marginTop: 3 }}>
                  Your seat for <strong>{conference.title}</strong> is confirmed.
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
          </div>

        ) : isFull ? (
          /* ── Seats Full → Waitlist ── */
          <div className="modal-body">
            <div style={{
              background: 'var(--n-error-bg)', border: '1.5px solid var(--n-red)',
              borderRadius: 'var(--radius-md)', padding: '16px 20px',
              display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16
            }}>
              <AlertTriangle size={22} color="var(--n-red)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--n-red)', fontSize: 14 }}>
                  This Program is at Full Capacity
                </div>
                <div style={{ fontSize: 13, color: 'var(--n-gray-mid)', marginTop: 3 }}>
                  All {conference.totalSeats} seats are filled. Join the waitlist to be notified when a seat opens.
                </div>
                <div style={{ fontSize: 12, color: 'var(--n-gray-mid)', marginTop: 8 }}>
                  🔔 {(conference.waitlist || []).length} people already on waitlist
                </div>
              </div>
            </div>

            {joinedWaitlist || onWaitlist ? (
              <div style={{
                background: 'var(--n-warning-bg)', border: '1.5px solid var(--n-warning)',
                borderRadius: 'var(--radius-md)', padding: '14px 18px',
                display: 'flex', alignItems: 'center', gap: 10
              }}>
                <CheckCircle size={20} color="var(--n-warning)" />
                <span style={{ fontWeight: 600, color: '#7B4F00', fontSize: 14 }}>
                  You're on the waitlist! We'll email you if a seat opens.
                </span>
              </div>
            ) : (
              <button
                className="btn btn-danger btn-lg"
                onClick={handleWaitlist}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <List size={16} /> Join Waitlist
              </button>
            )}

            <div style={{ marginTop: 14, textAlign: 'right' }}>
              <button className="btn btn-secondary btn-sm" onClick={onClose}>Close</button>
            </div>
          </div>

        ) : (
          /* ── Normal Registration Form ── */
          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Seat warning */}
              {seatsLeft <= 10 && (
                <div style={{
                  background: 'var(--n-warning-bg)', border: '1px solid rgba(245,127,23,0.4)',
                  borderRadius: 'var(--radius-md)', padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#7B4F00', fontWeight: 600
                }}>
                  ⚡ Only {seatsLeft} seat{seatsLeft === 1 ? '' : 's'} left — register now!
                </div>
              )}

              {/* Assessment notice */}
              {conference.hasAssessment && conference.assessmentEnabled && (
                <div style={{
                  background: 'var(--n-blue-pale)', border: '1px solid rgba(0,156,222,0.3)',
                  borderRadius: 'var(--radius-md)', padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--n-navy)', fontWeight: 600
                }}>
                  📝 This program includes a <strong style={{ marginLeft: 4 }}>Pre &amp; Post Assessment</strong>.
                </div>
              )}

              {/* Name + Email */}
              <div className="resp-grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-input"
                    type="text"
                    required
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Work Email</label>
                  <input
                    className="form-input"
                    type="email"
                    required
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* ── Meal (only if event hasMeal) ── */}
              {conference.hasMeal && (
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Utensils size={14} color="var(--n-navy)" />
                    Meal Preference
                    <span style={{ fontSize: 11, color: 'var(--n-success)', fontWeight: 700, marginLeft: 4 }}>
                      Complimentary
                    </span>
                  </label>
                  <div className="resp-grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { value: 'Veg',     label: '🥗 Vegetarian' },
                      { value: 'Non-Veg', label: '🍗 Non-Vegetarian' },
                    ].map(opt => {
                      const active = mealPreference === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setMealPreference(opt.value)}
                          style={{
                            padding: '14px 16px',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            border: `2px solid ${active ? 'var(--n-blue)' : 'var(--n-gray-border)'}`,
                            background: active ? 'var(--n-blue-pale)' : 'var(--n-white)',
                            color: active ? 'var(--n-navy)' : 'var(--n-gray-dark)',
                            fontWeight: active ? 800 : 600,
                            fontSize: 14,
                            textAlign: 'center',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Shuttle / Cab Section ── */}
              <div style={sectionCard}>
                {/* Toggle row */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: needCab ? 'rgba(0,48,135,0.12)' : 'rgba(0,0,0,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.2s ease'
                    }}>
                      <Car size={20} color={needCab ? 'var(--n-navy)' : 'var(--n-gray-mid)'} />
                    </div>
                    <div>
                      <div style={{
                        fontWeight: 700, fontSize: 14,
                        color: needCab ? 'var(--n-navy)' : 'var(--n-gray-dark)'
                      }}>
                        Book Corporate Shuttle
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--n-gray-mid)', marginTop: 1 }}>
                        Free cab pickup to the venue
                      </div>
                    </div>
                  </div>

                  {/* ✅ FIX: standalone div toggle — no label/input double-fire */}
                  <ToggleSwitch checked={needCab} onChange={setNeedCab} />
                </div>

                {/* Expandable location + slot (only when needCab is true) */}
                {needCab && (
                  <div style={{
                    borderTop: '1px solid var(--n-gray-border)',
                    padding: '14px 16px',
                    display: 'flex', flexDirection: 'column', gap: 12,
                    background: 'var(--n-white)'
                  }}>
                    <div>
                      <label className="form-label">📍 Pickup Location</label>
                      <select
                        className="form-input"
                        value={cabPickupLocation}
                        onChange={e => setCabPickupLocation(e.target.value)}
                      >
                        {CAB_LOCATIONS.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">🕐 Preferred Time Slot</label>
                      <select
                        className="form-input"
                        value={cabPickupSlot}
                        onChange={e => setCabPickupSlot(e.target.value)}
                      >
                        {CAB_SLOTS.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>

                    {/* Summary chip */}
                    <div style={{
                      background: 'var(--n-blue-pale)', borderRadius: 'var(--radius-sm)',
                      padding: '8px 12px', fontSize: 12, color: 'var(--n-navy)', fontWeight: 600
                    }}>
                      🚕 Confirmed: <strong>{cabPickupLocation}</strong> at <strong>{cabPickupSlot}</strong>
                    </div>
                  </div>
                )}
              </div>

            </div>{/* end modal-body */}

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                <Send size={15} />
                {submitting ? 'Registering...' : 'Confirm Registration'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
