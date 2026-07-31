import React, { useState } from 'react';
import { GALLERY_PHOTOS } from '../data/initialData';
import { Camera, Calendar, MapPin, Eye, Heart, Filter, X, Award, Search, Sparkles } from 'lucide-react';

export const GalleryView = () => {
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [likedPhotos, setLikedPhotos] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const months = ['All', 'May 2026', 'April 2026', 'March 2026'];

  const filteredPhotos = GALLERY_PHOTOS.filter(photo => {
    const matchMonth = selectedMonth === 'All' || photo.month === selectedMonth;
    const q = searchQuery.toLowerCase();
    const matchSearch = photo.title.toLowerCase().includes(q) ||
                        photo.program.toLowerCase().includes(q) ||
                        photo.caption.toLowerCase().includes(q);
    return matchMonth && matchSearch;
  });

  const toggleLike = (id) => {
    setLikedPhotos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header Banner */}
      <div style={{
        background: 'var(--grad-hero)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 32px',
        color: '#fff',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.15)', color: '#fff',
              padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
              border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)'
            }}>
              <Camera size={13} /> Monthly TLCE Event Highlights
            </span>
            <span style={{
              background: 'rgba(16,185,129,0.25)', color: '#A7F3D0',
              padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
              border: '1px solid rgba(16,185,129,0.4)'
            }}>
              <Sparkles size={11} style={{ display: 'inline', marginRight: 4 }} /> Last 3 Months
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 900, margin: '0 0 8px 0', lineHeight: 1.2 }}>
            TLCE Event Photo Gallery
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', margin: 0, maxWidth: 640, lineHeight: 1.5 }}>
            Explore authentic moments, keynote sessions, interactive workshops, and participant celebrations from our last 3 months of TLCE learning programs.
          </p>
        </div>
      </div>

      {/* Control Bar: Filter by Month + Search */}
      <div className="resp-control-bar" style={{
        background: 'var(--n-white)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--n-gray-border)', padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 14, boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Search */}
        <div className="resp-search-box" style={{ position: 'relative', flex: '1 1 240px', maxWidth: 360 }}>
          <Search size={15} color="var(--n-gray-mid)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="form-input"
            type="text"
            placeholder="Search gallery by program, speaker, topic..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 36, fontSize: 13 }}
          />
        </div>

        {/* Month Tabs */}
        <div className="resp-filter-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 6 }}>
            <Filter size={14} color="var(--n-navy)" />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--n-gray-dark)' }}>Month:</span>
          </div>
          <div className="resp-category-pills" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {months.map(m => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                style={{
                  padding: '7px 16px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                  background: selectedMonth === m ? 'var(--n-navy)' : 'var(--n-gray-light)',
                  color: selectedMonth === m ? '#fff' : 'var(--n-gray-dark)',
                  border: `1px solid ${selectedMonth === m ? 'var(--n-navy)' : 'var(--n-gray-border)'}`,
                  transition: 'all 0.15s ease'
                }}
              >
                {m === 'All' ? 'All Months (Last 3 M)' : m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {filteredPhotos.map(photo => {
          const isLiked = likedPhotos[photo.id];
          const likeCount = photo.likes + (isLiked ? 1 : 0);

          return (
            <div
              key={photo.id}
              style={{
                background: 'var(--n-white)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--n-gray-border)', overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column',
                transition: 'all 0.25s ease', cursor: 'pointer'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              onClick={() => setSelectedPhoto(photo)}
            >
              {/* Image Container */}
              <div style={{ position: 'relative', height: 210, overflow: 'hidden', background: '#E2E8F0' }}>
                <img
                  src={photo.image}
                  alt={photo.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 60%)' }} />

                {/* Month & Category badges */}
                <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 999,
                    background: 'var(--n-navy-dark)', color: '#fff', letterSpacing: 0.5
                  }}>
                    {photo.month}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                    background: 'rgba(255,255,255,0.9)', color: 'var(--n-navy-dark)', backdropFilter: 'blur(4px)'
                  }}>
                    {photo.category}
                  </span>
                </div>

                {/* Bottom stats */}
                <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: 12, color: '#fff', fontSize: 12, fontWeight: 600 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Eye size={13} /> {photo.views}
                  </span>
                  <span
                    onClick={(e) => { e.stopPropagation(); toggleLike(photo.id); }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: isLiked ? '#F43F5E' : '#fff' }}
                  >
                    <Heart size={13} fill={isLiked ? '#F43F5E' : 'none'} /> {likeCount}
                  </span>
                </div>
              </div>

              {/* Photo Details */}
              <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--n-navy-dark)', margin: 0, lineHeight: 1.3 }}>
                  {photo.title}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--n-gray-mid)', margin: 0, lineHeight: 1.45 }}>
                  {photo.caption}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--n-gray-border)', fontSize: 11, color: 'var(--n-gray-mid)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={12} color="var(--n-blue)" /> {photo.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={12} color="var(--n-blue)" /> {photo.location}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPhotos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--n-gray-mid)', background: 'var(--n-white)', borderRadius: 'var(--radius-lg)' }}>
          <Camera size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--n-navy-dark)' }}>No photos match your filter.</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Try clearing the search query or selecting "All Months".</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(11,15,25,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} onClick={() => setSelectedPhoto(null)}>
          <div style={{
            background: 'var(--n-white)', borderRadius: 'var(--radius-xl)',
            maxWidth: 720, width: '100%', overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'absolute', top: 16, right: 16, zIndex: 10,
                width: 36, height: 36, borderRadius: '50%', border: 'none',
                background: 'rgba(0,0,0,0.5)', color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)'
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Image */}
            <div style={{ height: 380, width: '100%', background: '#0F172A', position: 'relative' }}>
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{
                  fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 999,
                  background: 'var(--n-navy)', color: '#fff'
                }}>{selectedPhoto.month}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999,
                  background: 'var(--n-blue-pale)', color: 'var(--n-navy)'
                }}>{selectedPhoto.program}</span>
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--n-navy-dark)', margin: '0 0 8px 0' }}>
                {selectedPhoto.title}
              </h2>
              <p style={{ fontSize: 14, color: 'var(--n-gray-mid)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                {selectedPhoto.caption}
              </p>

              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--n-gray-dark)', borderTop: '1px solid var(--n-gray-border)', paddingTop: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={14} color="var(--n-blue)" /> {selectedPhoto.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={14} color="var(--n-blue)" /> {selectedPhoto.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
