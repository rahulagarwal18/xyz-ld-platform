import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { X, PlusCircle, Calendar, Users, MapPin, Sparkles } from 'lucide-react';

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

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 bg-white border border-slate-200 shadow-2xl">
        
        <div className="flex items-start justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-600" /> Create New L&D Conference
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              xyz Learning and Devlopemnt department
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          
          <div>
            <label className="form-label">Conference Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Generative AI for Enterprise Workflows"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="form-input text-xs"
            />
          </div>

          <div>
            <label className="form-label">Subtitle / Key Objective</label>
            <input
              type="text"
              required
              placeholder="Short description of topics covered"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              className="form-input text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="form-select text-xs"
              >
                <option value="Technology & AI">Technology & AI</option>
                <option value="Leadership & Management">Leadership & Management</option>
                <option value="Career & Personal Growth">Career & Personal Growth</option>
                <option value="Engineering & Infrastructure">Engineering & Infrastructure</option>
                <option value="Design & Product">Design & Product</option>
              </select>
            </div>

            <div>
              <label className="form-label">Total Seats Capacity</label>
              <input
                type="number"
                min="10"
                max="500"
                required
                value={totalSeats}
                onChange={e => setTotalSeats(e.target.value)}
                className="form-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Target Audience (comma-separated tags)</label>
            <input
              type="text"
              required
              placeholder="Engineering, Product, All Employees"
              value={targetAudienceInput}
              onChange={e => setTargetAudienceInput(e.target.value)}
              className="form-input text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Date</label>
              <input
                type="text"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="form-input text-xs"
              />
            </div>

            <div>
              <label className="form-label">Time</label>
              <input
                type="text"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                className="form-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Location / Stream</label>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="form-input text-xs"
              />
            </div>

            <div>
              <label className="form-label">Keynote Speaker</label>
              <input
                type="text"
                required
                value={speaker}
                onChange={e => setSpeaker(e.target.value)}
                className="form-input text-xs"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs">
              Publish & Broadcast Email
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
