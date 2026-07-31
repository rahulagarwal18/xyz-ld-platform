import React, { useState, useEffect, useCallback } from 'react';
import { useLD } from '../context/LDContext';
import { ArrowRight, ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Users, Award, AlertCircle, CheckCircle2 } from 'lucide-react';

const FEATURED_IDS = ['tlce-jan', 'tlce-apr', 'tlce-may', 'tlce-nov'];

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

  const slides = bannerConfs.length >= 2 ? bannerConfs : conferences.slice(0, 4);

  const goTo = useCallback((idx) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(idx);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const next = useCallback(() => goTo((activeIndex + 1) % slides.length), [activeIndex, slides.length, goTo]);
  const prev = useCallback(() => goTo((activeIndex - 1 + slides.length) % slides.length), [activeIndex, slides.length, goTo]);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const conf = slides[activeIndex];
  if (!conf) return null;

  const seatsLeft = conf.totalSeats - conf.registeredCount;
  const isFull = seatsLeft <= 0;
  const pct = Math.round((conf.registeredCount / conf.totalSeats) * 100);
  const isRegistered = registrations.some(r => r.conferenceId === conf.id && r.userEmail === currentUser?.email);

  return (
    <div className="resp-banner-container" style={{
      position: 'relative',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      display: 'flex',
      minHeight: 380,
      boxShadow: 'var(--shadow-xl)',
      background: '#00205B',
      userSelect: 'none'
    }}>
      {/* Background Slides */}
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

      {/* Gradients */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, rgba(0,20,60,0.96) 0%, rgba(0,32,91,0.8) 55%, rgba(0,0,0,0.1) 100%)',
        zIndex: 1
      }} />

      {/* Text Content */}
      <div className="resp-banner-details" style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '36px 44px',
        opacity: isAnimating ? 0 : 1,
        transition: 'opacity 0.3s ease',
        maxWidth: '65%',
        boxSizing: 'border-box'
      }}>
        {/* Top tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--n-red)', color: '#fff',
            padding: '5px 14px', borderRadius: 999,
            fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1
          }}>
            <Award size={11} /> {conf.bannerTag || 'TLCE Featured'}
          </span>
          <span style={{
            background: 'rgba(255,255,255,0.15)', color: '#fff',
            padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600
          }}>
            {conf.month} · {conf.durationHours}h Program
          </span>
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 900, color: '#fff',
          lineHeight: 1.2, margin: '0 0 8px 0', textShadow: '0 2px 10px rgba(0,0,0,0.4)'
        }}>
          {conf.title}
        </h2>
        <p style={{
          fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5,
          marginBottom: 16, fontWeight: 500
        }}>
          {conf.subtitle}
        </p>

        {/* Metadata info */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {[
            { icon: Calendar, text: conf.date },
            { icon: Clock, text: conf.time },
            { icon: MapPin, text: conf.location },
            { icon: Users, text: `${conf.registeredCount}/${conf.totalSeats} registered` },
          ].map(({ icon: Icon, text }) => (
            <span key={text} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(255,255,255,0.12)', color: '#fff',
              padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
              backdropFilter: 'blur(4px)'
            }}>
              <Icon size={12} /> {text}
            </span>
          ))}
        </div>

        {/* Seat progress bar */}
        <div style={{ marginBottom: 18, maxWidth: 300 }}>
          <div style={{
            height: 5, background: 'rgba(255,255,255,0.2)',
            borderRadius: 999, overflow: 'hidden', marginBottom: 4
          }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: isFull ? 'var(--n-red)' : pct >= 80 ? '#F59E0B' : 'var(--n-blue-light)',
              borderRadius: 999, transition: 'width 0.6s ease'
            }} />
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            {isFull ? <><AlertCircle size={12} color="var(--n-red)" /> Fully booked</> : <><CheckCircle2 size={12} color="#10B981" /> {seatsLeft} seats remaining ({pct}% filled)</>}
          </div>
        </div>

        {/* Register Actions */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => onSelectConference(conf)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 'var(--radius-md)', border: 'none',
              background: isRegistered ? 'rgba(46,125,50,0.95)' : 'var(--n-red)',
              color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            {isRegistered ? '✓ View Registration' : isFull ? '+ Join Waitlist' : 'Register Now'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Prev / Next buttons - Hidden on small viewports */}
      {[
        { side: 'left', action: prev, icon: ChevronLeft, pos: { left: 16 } },
        { side: 'right', action: next, icon: ChevronRight, pos: { right: 16 } },
      ].map(({ side, action, icon: Icon, pos }) => (
        <button
          key={side}
          onClick={action}
          className="resp-hide-mobile"
          style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            zIndex: 5, ...pos,
            width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(0,0,0,0.3)', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)', transition: 'all 0.15s ease'
          }}
        >
          <Icon size={18} />
        </button>
      ))}

      {/* Bottom slide dots indicator */}
      <div className="resp-banner-footer" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
        padding: '12px 44px',
        background: 'linear-gradient(to top, rgba(0,20,60,0.7) 0%, transparent 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              style={{
                height: 4, borderRadius: 999, border: 'none', cursor: 'pointer',
                width: i === activeIndex ? 24 : 6,
                background: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.2s ease', padding: 0
              }}
            />
          ))}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Keynote Speaker</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{conf.speaker}</div>
        </div>
      </div>
    </div>
  );
};
