import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { Search, Filter, Calendar, Clock, MapPin, ArrowRight, CheckCircle2, BookOpen, MessageSquare, Users, ClipboardList, Utensils, Zap, Bell, CheckCircle, Info } from 'lucide-react';
import { AssessmentModal } from './AssessmentModal';
import { FeedbackModal } from './FeedbackModal';
import { ProgramDetailsModal } from './ProgramDetailsModal';

export const ConferenceList = ({ onSelectConference }) => {
  const { conferences, registrations, currentUser, assessmentResults } = useLD();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAudience, setSelectedAudience] = useState('All');
  const [assessmentModal, setAssessmentModal] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [viewDetailsConf, setViewDetailsConf] = useState(null);

  const filtered = conferences.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchSearch = c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q) || c.speaker.toLowerCase().includes(q);
    const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchAud = selectedAudience === 'All' || c.targetAudience.includes(selectedAudience);
    return matchSearch && matchCat && matchAud;
  });

  const categories = ['All', ...new Set(conferences.map(c => c.category))];
  const audiences = ['All', 'Engineering', 'Leadership', 'Product', 'HR', 'All Employees', 'Design', 'Finance'];

  const FALLBACK_MAP = {
    'tlce-jan': 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85',
    'tlce-feb': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85',
    'tlce-mar': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=85',
    'tlce-apr': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85',
    'tlce-may': 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=85',
    'tlce-jun': 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=85',
    'tlce-jul': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85',
    'tlce-aug': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
    'tlce-sep': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85',
    'tlce-oct': 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=85',
    'tlce-nov': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85',
    'tlce-dec': 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85',
  };

  const getFallbackImg = (id) => FALLBACK_MAP[id] || 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Control Bar */}
      <div className="resp-control-bar" style={{
        background: 'var(--n-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--n-gray-border)',
        padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12
      }}>
        {/* Search */}
        <div className="resp-search-box" style={{ position: 'relative', flex: '1 1 260px', maxWidth: 360 }}>
          <Search size={15} color="var(--n-gray-mid)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="form-input"
            type="text"
            placeholder="Search TLCE programs, speakers, topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 36, fontSize: 13 }}
          />
        </div>

        <div className="resp-filter-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          {/* Category Pills */}
          <div className="resp-category-pills" style={{
            display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto',
            background: 'var(--n-gray-light)', padding: '4px 6px', borderRadius: 10,
            border: '1px solid var(--n-gray-border)'
          }}>
            {categories.slice(0, 5).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
                  background: selectedCategory === cat ? 'var(--n-navy)' : 'transparent',
                  color: selectedCategory === cat ? '#fff' : 'var(--n-gray-mid)',
                  transition: 'all 0.15s ease'
                }}
              >{cat}</button>
            ))}
          </div>

          {/* Audience Filter */}
          <div className="resp-audience-select" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--n-gray-light)', padding: '6px 12px', borderRadius: 10, border: '1px solid var(--n-gray-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Filter size={13} color="var(--n-blue)" />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--n-gray-mid)' }}>Audience:</span>
            </div>
            <select
              value={selectedAudience}
              onChange={e => setSelectedAudience(e.target.value)}
              style={{ background: 'transparent', border: 'none', fontSize: 12, fontWeight: 700, color: 'var(--n-navy)', cursor: 'pointer', outline: 'none' }}
            >
              {audiences.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Program Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {filtered.map(conf => {
          const isRegistered = registrations.some(r => r.conferenceId === conf.id && r.userEmail === currentUser.email);
          const myReg = registrations.find(r => r.conferenceId === conf.id && r.userEmail === currentUser.email);
          const isFull = conf.registeredCount >= conf.totalSeats;
          const pct = Math.round((conf.registeredCount / conf.totalSeats) * 100);
          const seatsLeft = conf.totalSeats - conf.registeredCount;
          const onWaitlist = (conf.waitlist || []).some(w => w.email === currentUser.email);
          const myAssessments = assessmentResults.filter(r => r.conferenceId === conf.id && r.userEmail === currentUser.email);
          const preAssessmentDone = myAssessments.some(r => r.type === 'pre');
          const postAssessmentDone = myAssessments.some(r => r.type === 'post');

          return (
            <div key={conf.id} style={{
              background: 'var(--n-white)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--n-gray-border)',
              borderTop: `4px solid ${isFull ? 'var(--n-red)' : isRegistered ? 'var(--n-success)' : 'var(--n-navy)'}`,
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
              boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.25s ease, transform 0.25s ease'
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}
            >
              {/* Card Image */}
              <div style={{ position: 'relative', height: 160, overflow: 'hidden', background: '#ddd' }}>
                <img
                  src={conf.image || getFallbackImg(conf.id)}
                  alt={conf.title}
                  onError={e => { e.target.onerror = null; e.target.src = getFallbackImg(conf.id); }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                />
                {/* Overlays */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', top: 10, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 999,
                    background: 'rgba(0,32,91,0.85)', color: '#fff', letterSpacing: 0.3
                  }}>{conf.category}</span>
                  {isFull && !isRegistered
                    ? <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 999, background: 'rgba(204,0,0,0.9)', color: '#fff' }}>WAITLIST</span>
                    : pct >= 80 && !isRegistered
                    ? <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 999, background: 'rgba(245,127,23,0.9)', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 3 }}><Zap size={10} /> FILLING FAST</span>
                    : isRegistered
                    ? <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 999, background: 'rgba(46,125,50,0.9)', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 3 }}><CheckCircle size={10} /> ENROLLED</span>
                    : null}
                </div>
                <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{conf.bannerTag}</span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--n-navy-dark)', lineHeight: 1.25, margin: 0 }}>{conf.title}</h3>
                  <p style={{ fontSize: 12, color: 'var(--n-gray-mid)', marginTop: 4, lineHeight: 1.4 }}>{conf.subtitle}</p>
                </div>

                {/* Audience tags */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {conf.targetAudience.slice(0, 3).map((a, i) => (
                    <span key={i} className="badge badge-blue" style={{ fontSize: 9 }}>{a}</span>
                  ))}
                </div>

                {/* Feature badges */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {conf.hasMeal && <span className="badge badge-green" style={{ fontSize: 9, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Utensils size={10} /> Meal</span>}
                  {conf.hasAssessment && <span className="badge badge-navy" style={{ fontSize: 9, display: 'inline-flex', alignItems: 'center', gap: 4 }}><ClipboardList size={10} /> Assessment</span>}
                  {conf.durationHours && <span className="badge badge-gray" style={{ fontSize: 9, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={10} /> {conf.durationHours}h</span>}
                  {(conf.waitlist || []).length > 0 && <span className="badge badge-amber" style={{ fontSize: 9, display: 'inline-flex', alignItems: 'center', gap: 4 }}><Bell size={10} /> {(conf.waitlist || []).length} waitlisted</span>}
                </div>

                {/* Schedule */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 8, borderTop: '1px solid var(--n-gray-border)' }}>
                  {[
                    { icon: Calendar, text: conf.date },
                    { icon: Clock, text: conf.time },
                    { icon: MapPin, text: conf.location },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--n-gray-dark)' }}>
                      <Icon size={12} color="var(--n-blue)" /> {text}
                    </div>
                  ))}
                </div>

                {/* Seat progress */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: 'var(--n-gray-dark)', marginBottom: 5 }}>
                    <span>Seats</span>
                    <span style={{ color: isFull ? 'var(--n-red)' : seatsLeft <= 10 ? 'var(--n-warning)' : 'var(--n-success)' }}>
                      {isFull ? 'FULL' : `${seatsLeft} left`} ({conf.registeredCount}/{conf.totalSeats})
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${pct}%`,
                      background: pct >= 100 ? 'var(--n-red)' : pct >= 80 ? 'var(--n-warning)' : 'var(--grad-blue)'
                    }} />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto', paddingTop: 8 }}>
                  {isRegistered ? (
                    <>
                      <button disabled style={{
                        width: '100%', padding: '10px', borderRadius: 'var(--radius-md)',
                        background: 'var(--n-success-bg)', border: '1.5px solid var(--n-success)',
                        color: 'var(--n-success)', fontWeight: 700, fontSize: 13,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                      }}>
                        <CheckCircle2 size={15} /> Registered ✓
                      </button>

                      {/* Assessment buttons */}
                      {conf.hasAssessment && conf.assessmentEnabled && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            className="btn btn-outline-blue btn-sm"
                            style={{ flex: 1, justifyContent: 'center', opacity: preAssessmentDone ? 0.5 : 1 }}
                            onClick={() => !preAssessmentDone && setAssessmentModal({ conf, type: 'pre' })}
                          >
                            <BookOpen size={12} />
                            {preAssessmentDone ? '✓ Pre Done' : 'Pre-Assessment'}
                          </button>
                          <button
                            className="btn btn-outline-blue btn-sm"
                            style={{ flex: 1, justifyContent: 'center', opacity: postAssessmentDone ? 0.5 : 1 }}
                            onClick={() => !postAssessmentDone && setAssessmentModal({ conf, type: 'post' })}
                          >
                            <ClipboardList size={12} />
                            {postAssessmentDone ? '✓ Post Done' : 'Post-Assessment'}
                          </button>
                        </div>
                      )}

                      {/* Feedback button */}
                      {!myReg?.feedbackSubmitted && (
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ width: '100%', justifyContent: 'center' }}
                          onClick={() => setFeedbackModal(conf)}
                        >
                          <MessageSquare size={12} /> Submit Feedback
                        </button>
                      )}
                      {myReg?.feedbackSubmitted && (
                        <span style={{ textAlign: 'center', fontSize: 12, color: 'var(--n-success)', fontWeight: 600 }}>
                          ✓ Feedback Submitted
                        </span>
                      )}
                    </>
                  ) : isFull ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setViewDetailsConf(conf)}
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        <Info size={13} /> Description
                      </button>
                      <button
                        onClick={() => onSelectConference(conf)}
                        className="btn btn-danger btn-sm"
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        <Users size={13} /> {onWaitlist ? 'On Waitlist' : 'Join Waitlist'}
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setViewDetailsConf(conf)}
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        <Info size={13} /> Description
                      </button>
                      <button
                        onClick={() => onSelectConference(conf)}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        Register <ArrowRight size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--n-gray-mid)' }}>
          <Search size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p style={{ fontWeight: 600, fontSize: 16 }}>No TLCE programs match your search.</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Try a different keyword or clear the filters.</p>
        </div>
      )}

      {/* Program Details Overview Modal */}
      {viewDetailsConf && (
        <ProgramDetailsModal
          conference={viewDetailsConf}
          onClose={() => setViewDetailsConf(null)}
          onRegister={(c) => onSelectConference(c)}
        />
      )}

      {/* Assessment Modal */}
      {assessmentModal && (
        <AssessmentModal
          conference={assessmentModal.conf}
          type={assessmentModal.type}
          onClose={() => setAssessmentModal(null)}
        />
      )}

      {/* Feedback Modal */}
      {feedbackModal && (
        <FeedbackModal
          conference={feedbackModal}
          onClose={() => setFeedbackModal(null)}
        />
      )}
    </div>
  );
};
