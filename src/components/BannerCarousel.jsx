import React, { useState, useEffect, useCallback } from 'react';
import { useLD } from '../context/LDContext';
import { ArrowRight, ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Users, Award } from 'lucide-react';

// Pick 4 featured programs for the carousel
const FEATURED_IDS = ['tlce-jan', 'tlce-apr', 'tlce-may', 'tlce-nov'];

// Fallback high-quality Unsplash images
const FALLBACKS = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=85',
];

export const BannerCarousel = ({ onSelectConference }) => {
  const { conferences, registrations, currentUser } = useLD();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const bannerConfs = FEATURED_IDS
    .map(id => conferences.find(c => c.id === id))
    .filter(Boolean);

  // fallback: just take first 4 if IDs differ
  const slides = bannerConfs.length >= 2 ? bannerConfs : conferences.slice(0, 4);

  const goTo = useCallback((idx) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(idx);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const next = useCallback(() => goTo((activeIndex + 1) % slides.length), [activeIndex, slides.length, goTo]);
  const prev = useCallback(() => goTo((activeIndex - 1 + slides.length) % slides.length), [activeIndex, slides.length, goTo]);

  // Auto-play every 6 seconds
  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const conf = slides[activeIndex];
  if (!conf) return null;

  const imgSrc = conf.image || FALLBACKS[activeIndex % FALLBACKS.length];
  const seatsLeft = conf.totalSeats - conf.registeredCount;
  const isFull = seatsLeft <= 0;
  const pct = Math.round((conf.registeredCount / conf.totalSeats) * 100);
  const isRegistered = registrations.some(r => r.conferenceId === conf.id && r.userEmail === currentUser?.email);

  return (
    <div style={{
      position: 'relative',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      height: 420,
      boxShadow: 'var(--shadow-xl)',
      background: '#00205B',
      userSelect: 'none'
    }}>
      {/* ── Slide Background Image ── */}
      {slides.map((s, i) => (
        <img
          key={s.id}
          src={s.image || FALLBACKS[i % FALLBACKS.length]}
          alt={s.title}
          onError={e => { e.target.onerror = null; e.target.src = FALLBACKS[i % FALLBACKS.length]; }}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: i === activeIndex ? 1 : 0,
            transition: 'opacity 0.6s ease',
            zIndex: 0
          }}
        />
      ))}

      {/* ── Gradient Overlay ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, rgba(0,20,60,0.95) 0%, rgba(0,32,91,0.75) 45%, rgba(0,0,0,0.1) 100%)',
        zIndex: 1
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,20,60,0.6) 0%, transparent 50%)',
        zIndex: 1
      }} />

      {/* ── Slide Content ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '36px 44px',
        opacity: isAnimating ? 0 : 1,
        transition: 'opacity 0.3s ease',
        maxWidth: '62%'
      }}>
        {/* Top tag row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--n-red)', color: '#fff',
            padding: '5px 14px', borderRadius: 999,
            fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.2
          }}>
            <Award size={11} /> {conf.bannerTag || 'TLCE Featured'}
          </span>
          <span style={{
            background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)',
            padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            {conf.month} 2026 · {conf.durationHours}h Program
          </span>
          {conf.hasAssessment && (
            <span style={{
              background: 'rgba(0,156,222,0.3)', color: '#fff',
              padding: '4px 12px', borderRadius: 999, fontSize: 10, fontWeight: 700,
              border: '1px solid rgba(0,156,222,0.4)'
            }}>📝 Assessment</span>
          )}
          {conf.hasMeal && (
            <span style={{
              background: 'rgba(46,125,50,0.4)', color: '#fff',
              padding: '4px 12px', borderRadius: 999, fontSize: 10, fontWeight: 700,
              border: '1px solid rgba(46,125,50,0.4)'
            }}>🍽️ Meal Included</span>
          )}
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, color: '#fff',
          lineHeight: 1.15, margin: 0, marginBottom: 10,
          textShadow: '0 2px 12px rgba(0,0,0,0.5)'
        }}>
          {conf.title}
        </h2>
        <p style={{
          fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.55,
          marginBottom: 18, fontWeight: 500, maxWidth: 460
        }}>
          {conf.subtitle}
        </p>

        {/* Meta info row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {[
            { icon: Calendar, text: conf.date },
            { icon: Clock, text: conf.time },
            { icon: MapPin, text: conf.location },
            { icon: Users, text: `${conf.registeredCount}/${conf.totalSeats} registered` },
          ].map(({ icon: Icon, text }) => (
            <span key={text} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)',
              padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)'
            }}>
              <Icon size={12} /> {text}
            </span>
          ))}
        </div>

        {/* Seat bar */}
        <div style={{ marginBottom: 20, maxWidth: 300 }}>
          <div style={{
            height: 5, background: 'rgba(255,255,255,0.2)',
            borderRadius: 999, overflow: 'hidden', marginBottom: 5
          }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: isFull ? 'var(--n-red)' : pct >= 80 ? '#F59E0B' : 'var(--n-blue-light)',
              borderRadius: 999, transition: 'width 0.6s ease'
            }} />
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
            {isFull ? '🔴 Fully booked — Waitlist available' : `🟢 ${seatsLeft} seats remaining (${100 - pct}% open)`}
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={() => onSelectConference(conf)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '13px 28px', borderRadius: 'var(--radius-md)', border: 'none',
              background: isRegistered ? 'rgba(46,125,50,0.9)' : 'var(--n-red)',
              color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.35)'; }}
          >
            {isRegistered ? '✓ View Registration' : isFull ? '+ Join Waitlist' : 'Register Now'}
            <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {conf.targetAudience?.slice(0, 2).map((a, i) => (
              <span key={i} style={{
                fontSize: 11, fontWeight: 700, padding: '5px 11px', borderRadius: 999,
                background: 'rgba(255,255,255,0.15)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)'
              }}>{a}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Prev / Next Arrow Buttons ── */}
      {[
        { side: 'left', action: prev, icon: ChevronLeft, pos: { left: 16 } },
        { side: 'right', action: next, icon: ChevronRight, pos: { right: 16 } },
      ].map(({ side, action, icon: Icon, pos }) => (
        <button
          key={side}
          onClick={action}
          style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            zIndex: 5, ...pos,
            width: 44, height: 44, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)',
            background: 'rgba(0,0,0,0.35)', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(6px)', transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,156,222,0.6)'; e.currentTarget.style.borderColor = 'rgba(0,156,222,0.8)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
        >
          <Icon size={20} />
        </button>
      ))}

      {/* ── Bottom: Dot Indicators + Slide Counter ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
        padding: '12px 44px',
        background: 'linear-gradient(to top, rgba(0,20,60,0.7) 0%, transparent 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Dot nav */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              title={s.title}
              style={{
                height: 4, borderRadius: 999, border: 'none', cursor: 'pointer',
                width: i === activeIndex ? 32 : 8,
                background: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.3s ease', padding: 0
              }}
            />
          ))}
        </div>

        {/* Speaker credit */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>Keynote</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{conf.speaker}</div>
        </div>
      </div>

      {/* ── Slide number badge (top right) ── */}
      <div style={{
        position: 'absolute', top: 16, right: 16, zIndex: 4,
        background: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.8)',
        padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
        backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)'
      }}>
        {activeIndex + 1} / {slides.length}
      </div>
    </div>
  );
};
