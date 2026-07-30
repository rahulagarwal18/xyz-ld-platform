import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { X, PlusCircle } from 'lucide-react';

const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
    <label style={{ 
      fontSize: 12, 
      fontWeight: 700, 
      color: '#00205B', 
      letterSpacing: '0.1px' 
    }}>
      {label}
    </label>
    {children}
  </div>
);

const StyledInput = ({ type = 'text', placeholder, value, onChange, required = true, min, max }) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      max={max}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%', 
        padding: '10px 12px',
        borderRadius: 8, 
        border: focused ? '2px solid #009CDE' : '1px solid #D1D5DB',
        fontSize: 13, 
        fontFamily: 'var(--font-sans)', 
        color: '#333333',
        background: '#ffffff', 
        outline: 'none', 
        boxSizing: 'border-box',
        transition: 'all 0.15s ease',
        boxShadow: focused ? '0 0 0 3px rgba(0, 156, 222, 0.15)' : 'none'
      }}
    />
  );
};

export const CreateConferenceModal = ({ isOpen, onClose }) => {
  const { addNewConference } = useLD();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Technology & AI');
  const [targetAudienceInput, setTargetAudienceInput] = useState('Engineering, Product, All Employees');
  const [totalSeats, setTotalSeats] = useState(100);
  const [date, setDate] = useState('Oct 10, 2026');
  const [time, setTime] = useState('10:00 AM - 01:00 PM EST');
  const [location, setLocation] = useState('Main Auditorium & Virtual Stream');
  const [speaker, setSpeaker] = useState('Senior L&D Faculty');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetAudience = targetAudienceInput.split(',').map(s => s.trim()).filter(Boolean);

    addNewConference({
      title,
      subtitle,
      category,
      targetAudience,
      totalSeats: parseInt(totalSeats, 10),
      date,
      time,
      location,
      speaker
    });

    onClose();
  };

  const selectStyle = {
    width: '100%', 
    padding: '10px 12px', 
    borderRadius: 8, 
    border: '1px solid #D1D5DB',
    fontSize: 13, 
    fontFamily: 'var(--font-sans)', 
    color: '#333333', 
    background: '#ffffff',
    outline: 'none', 
    boxSizing: 'border-box', 
    cursor: 'pointer'
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9100,
      background: 'rgba(0, 20, 60, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: 580,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E2E8F0',
          background: 'linear-gradient(135deg, #003087 0%, #00205B 100%)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
              <PlusCircle size={20} color="#009CDE" /> Create New L&amp;D Conference
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
              xyz Learning and Development Department
            </p>
          </div>
          <button 
            onClick={onClose} 
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: 8,
              padding: 6,
              cursor: 'pointer',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} style={{
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          margin: 0
        }}>
          
          <Field label="Conference Title">
            <StyledInput
              placeholder="e.g. Generative AI for Enterprise Workflows"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </Field>

          <Field label="Subtitle / Key Objective">
            <StyledInput
              placeholder="Short description of topics covered"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Category">
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={selectStyle}
              >
                <option value="Technology &amp; AI">Technology &amp; AI</option>
                <option value="Leadership &amp; Management">Leadership &amp; Management</option>
                <option value="Career &amp; Personal Growth">Career &amp; Personal Growth</option>
                <option value="Engineering &amp; Infrastructure">Engineering &amp; Infrastructure</option>
                <option value="Design &amp; Product">Design &amp; Product</option>
              </select>
            </Field>

            <Field label="Total Seats Capacity">
              <StyledInput
                type="number"
                min="10"
                max="500"
                value={totalSeats}
                onChange={e => setTotalSeats(e.target.value)}
              />
            </Field>
          </div>

          <Field label="Target Audience (comma-separated tags)">
            <StyledInput
              placeholder="Engineering, Product, All Employees"
              value={targetAudienceInput}
              onChange={e => setTargetAudienceInput(e.target.value)}
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Date">
              <StyledInput
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </Field>

            <Field label="Time">
              <StyledInput
                value={time}
                onChange={e => setTime(e.target.value)}
              />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Location / Stream">
              <StyledInput
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </Field>

            <Field label="Keynote Speaker">
              <StyledInput
                value={speaker}
                onChange={e => setSpeaker(e.target.value)}
              />
            </Field>
          </div>

          {/* Footer Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
            marginTop: 8,
            paddingTop: 18,
            borderTop: '1px solid #E2E8F0'
          }}>
            <button 
              type="button" 
              onClick={onClose} 
              style={{
                padding: '10px 18px',
                borderRadius: 8,
                border: '1px solid #D1D5DB',
                background: '#ffffff',
                color: '#333333',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={{
                padding: '10px 18px',
                borderRadius: 8,
                border: 'none',
                background: '#003087',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                boxShadow: '0 4px 12px rgba(0,48,135,0.2)'
              }}
            >
              Publish &amp; Broadcast Email
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
