import React, { useState } from 'react';
import { GALLERY_PHOTOS } from '../data/initialData';
import { Camera, Calendar, MapPin, Eye, Heart, Filter, X, Award, Search, Sparkles, Image } from 'lucide-react';

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

      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 40%, #4F46E5 80%, #0EA5E9 100%)',
        borderRadius: 24,
        padding: '32px 36px',
        color: '#ffffff',
        boxShadow: '0 10px 30px rgba(15,23,42,0.18)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Background Mesh Overlay */}
        <div style={{
          position: 'absolute', right: -40, bottom: -40, width: 300, height: 300,
          borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.15)', color: '#ffffff',
              padding: '5px 14px', borderRadius: 999, fontSize: 11, fontWeight: 800,
              border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)'
            }}>
              <Camera size={13} /> Monthly TLCE Event Highlights
            </span>
            <span style={{
              background: 'rgba(16,185,129,0.25)', color: '#6EE7B7',
              padding: '5px 14px', borderRadius: 999, fontSize: 11, fontWeight: 800,
              border: '1px solid rgba(16,185,129,0.4)', backdropFilter: 'blur(6px)',
              display: 'inline-flex', alignItems: 'center', gap: 4
            }}>
              <Sparkles size={12} /> Last 3 Months Photo Stream
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 34px)',
            fontWeight: 900,
            color: '#ffffff',
            margin: '0 0 10px 0',
            lineHeight: 1.2,
            letterSpacing: '-0.5px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            TLCE Event Photo Gallery
          </h2>
          <p style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.9)',
            margin: 0,
            maxWidth: 640,
            lineHeight: 1.6,
            fontWeight: 500
          }}>
            Explore authentic moments, keynote sessions, interactive workshops, and participant celebrations from our last 3 months of TLCE learning programs across xyz campuses.
          </p>
        </div>
      </div>

      {/* ── Control Bar: Month Filter + Search ── */}
      <div className="resp-control-bar" style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #E2E8F0',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: 14,
        boxShadow: '0 4px 14px rgba(11,15,25,0.03)'
      }}>
        {/* Search */}
        <div className="resp-search-box" style={{ position: 'relative', flex: '1 1 240px', maxWidth: 380 }}>
          <Search size={15} color="#64748B" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="form-input"
            type="text"
            placeholder="Search gallery by program, speaker, location..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: 38,
              fontSize: 13,
              borderRadius: 10,
              border: '1px solid #CBD5E1',
              background: '#F8FAFC'
            }}
          />
        </div>

        {/* Month Pills */}
        <div className="resp-filter-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 4 }}>
            <Filter size={14} color="#4F46E5" />
            <span style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>Filter Month:</span>
          </div>
          <div className="resp-category-pills" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {months.map(m => {
              const active = selectedMonth === m;
              return (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 999,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    background: active ? '#4F46E5' : '#F1F5F9',
                    color: active ? '#ffffff' : '#475569',
                    boxShadow: active ? '0 4px 12px rgba(79,70,229,0.3)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {m === 'All' ? 'All Months (Last 3 Months)' : m}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Photo Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {filteredPhotos.map(photo => {
          const isLiked = likedPhotos[photo.id];
          const likeCount = photo.likes + (isLiked ? 1 : 0);

          return (
            <div
              key={photo.id}
              style={{
                background: '#ffffff',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                boxShadow: '0 4px 14px rgba(11,15,25,0.03)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(79,70,229,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(11,15,25,0.03)';
              }}
              onClick={() => setSelectedPhoto(photo)}
            >
              {/* Image Box */}
              <div style={{ position: 'relative', height: 220, overflow: 'hidden', background: '#0F172A' }}>
                <img
                  src={photo.image}
                  alt={photo.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.75) 0%, transparent 60%)' }} />

                {/* Top Badges */}
                <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 999,
                    background: 'rgba(15,23,42,0.85)', color: '#ffffff', backdropFilter: 'blur(6px)', letterSpacing: 0.5
                  }}>
                    {photo.month}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 999,
                    background: 'rgba(255,255,255,0.9)', color: '#0F172A', backdropFilter: 'blur(6px)'
                  }}>
                    {photo.category}
                  </span>
                </div>

                {/* Bottom Overlay Stats */}
                <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: 12, color: '#ffffff', fontSize: 12, fontWeight: 600 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Eye size={14} /> {photo.views}
                  </span>
                  <span
                    onClick={(e) => { e.stopPropagation(); toggleLike(photo.id); }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer',
                      color: isLiked ? '#F43F5E' : '#ffffff',
                      transition: 'color 0.15s ease'
                    }}
                  >
                    <Heart size={14} fill={isLiked ? '#F43F5E' : 'none'} color={isLiked ? '#F43F5E' : '#ffffff'} /> {likeCount}
                  </span>
                </div>
              </div>

              {/* Details Box */}
              <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.35, letterSpacing: '-0.2px' }}>
                  {photo.title}
                </h3>
                <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                  {photo.caption}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #F1F5F9', fontSize: 11, color: '#64748B' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                    <Calendar size={12} color="#4F46E5" /> {photo.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={12} color="#0EA5E9" /> {photo.location}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPhotos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B', background: '#ffffff', borderRadius: 16, border: '1px solid #E2E8F0' }}>
          <Camera size={44} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontWeight: 800, fontSize: 16, color: '#0F172A', margin: '0 0 4px 0' }}>No event photos found</h3>
          <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>Try adjusting your search terms or selecting "All Months".</p>
        </div>
      )}

      {/* ── Lightbox Modal ── */}
      {selectedPhoto && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} onClick={() => setSelectedPhoto(null)}>
          <div style={{
            background: '#ffffff', borderRadius: 24,
            maxWidth: 720, width: '100%', overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            position: 'relative', animation: 'modalSlide 0.25s ease'
          }} onClick={e => e.stopPropagation()}>

            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'absolute', top: 16, right: 16, zIndex: 10,
                width: 36, height: 36, borderRadius: '50%', border: 'none',
                background: 'rgba(15,23,42,0.6)', color: '#ffffff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)', transition: 'background 0.15s ease'
              }}
            >
              <X size={18} />
            </button>

            {/* Photo View */}
            <div style={{ height: 380, width: '100%', background: '#0F172A', position: 'relative' }}>
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Photo Metadata Details */}
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 999,
                  background: '#4F46E5', color: '#ffffff'
                }}>{selectedPhoto.month}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999,
                  background: '#F0F9FF', color: '#0EA5E9', border: '1px solid #BAE6FD'
                }}>{selectedPhoto.program}</span>
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: '0 0 8px 0', lineHeight: 1.3, letterSpacing: '-0.3px' }}>
                {selectedPhoto.title}
              </h2>
              <p style={{ fontSize: 14, color: '#475569', margin: '0 0 18px 0', lineHeight: 1.6, fontWeight: 500 }}>
                {selectedPhoto.caption}
              </p>

              <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#334155', borderTop: '1px solid #E2E8F0', paddingTop: 16, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                  <Calendar size={14} color="#4F46E5" /> {selectedPhoto.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={14} color="#0EA5E9" /> {selectedPhoto.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', color: '#64748B' }}>
                  <Eye size={14} /> {selectedPhoto.views} Views
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
