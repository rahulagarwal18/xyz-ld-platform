import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { X, Utensils, Car, Send } from 'lucide-react';

export const RegistrationModal = ({ conference, onClose }) => {
  const { currentUser, registerForConference } = useLD();

  const [userName, setUserName] = useState(currentUser.name);
  const [userEmail, setUserEmail] = useState(currentUser.email);
  const [department, setDepartment] = useState(currentUser.department || 'Engineering');
  
  const [mealPreference, setMealPreference] = useState('Veg 🥗');
  const [needCab, setNeedCab] = useState(false);
  const [cabPickupLocation, setCabPickupLocation] = useState('City Tech Park Shuttle Station');
  const [cabPickupSlot, setCabPickupSlot] = useState('09:15 AM Batch');

  const [submitting, setSubmitting] = useState(false);

  if (!conference) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const userInfo = {
      id: currentUser.id,
      name: userName,
      email: userEmail,
      department
    };

    const res = registerForConference({
      conferenceId: conference.id,
      userInfo,
      mealPreference,
      needCab,
      cabPickupLocation,
      cabPickupSlot
    });

    setSubmitting(false);

    if (res.success) {
      onClose();
    }
  };

  const mealOptions = [
    { label: 'Veg 🥗', desc: 'Vegetarian Catering' },
    { label: 'Non-Veg 🍗', desc: 'Gourmet Non-Veg' },
    { label: 'Vegan 🌿', desc: 'Plant-Based' },
    { label: 'Jain 🍲', desc: 'No Root Vegetables' },
    { label: 'Gluten-Free 🌾', desc: 'Gluten-Free Menu' },
    { label: 'No Preference 🍴', desc: 'Standard Catering' }
  ];

  const cabLocations = [
    'City Tech Park Shuttle Station',
    'Main HQ Tower A Plaza',
    'North Metro Gate 2 Hub',
    'East Business Bay Pickup Point',
    'Airport Express Terminal'
  ];

  const cabSlots = [
    '08:30 AM Batch',
    '09:15 AM Batch',
    '10:00 AM Batch',
    '01:15 PM Batch (Afternoon Session)'
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 space-y-5 border-t-4 border-t-[#0066cc]">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-[#001e42] text-white uppercase tracking-widest">
              OFFICIAL REGISTRATION
            </span>
            <h3 className="text-xl font-extrabold text-[#001e42] mt-1">
              {conference.title}
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              xyz Learning and Devlopemnt department
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded bg-slate-100 text-slate-500 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* User Information */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label-nielsen">Full Name</label>
              <input
                type="text"
                required
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="input-nielsen text-xs"
              />
            </div>
            <div>
              <label className="form-label-nielsen">Work Email</label>
              <input
                type="email"
                required
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                className="input-nielsen text-xs"
              />
            </div>
          </div>

          {/* Meal Preference */}
          <div>
            <label className="form-label-nielsen flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-extrabold text-slate-900">
                <Utensils className="w-4 h-4 text-[#0066cc]" /> Meal Preference Selection
              </span>
              <span className="text-[11px] text-emerald-700 font-bold normal-case">Complimentary Catering Included</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {mealOptions.map(opt => (
                <button
                  type="button"
                  key={opt.label}
                  onClick={() => setMealPreference(opt.label)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    mealPreference === opt.label
                      ? 'bg-[#001e42] text-white border-[#001e42] shadow-sm font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-extrabold text-xs">{opt.label}</div>
                  <div className="text-[10px] opacity-80 truncate font-medium">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Shuttle Cab Booking */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#0066cc]/10 text-[#0066cc]">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-[#001e42]">Do you want to book a cab shuttle?</div>
                  <div className="text-xs text-slate-500 font-medium">Free corporate shuttle service</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={needCab}
                  onChange={e => setNeedCab(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            {needCab && (
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div>
                  <label className="form-label-nielsen">Shuttle Pickup Location</label>
                  <select
                    value={cabPickupLocation}
                    onChange={e => setCabPickupLocation(e.target.value)}
                    className="input-nielsen text-xs"
                  >
                    {cabLocations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label-nielsen">Preferred Time Slot</label>
                  <select
                    value={cabPickupSlot}
                    onChange={e => setCabPickupSlot(e.target.value)}
                    className="input-nielsen text-xs"
                  >
                    {cabSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
            <button type="button" onClick={onClose} className="btn-nielsen-secondary text-xs">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-nielsen-primary text-xs !py-2.5 !px-5">
              <Send className="w-4 h-4" />
              <span>Confirm & Dispatch Mail</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
