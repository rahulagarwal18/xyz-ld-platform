import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { Search, Filter, Calendar, Clock, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ConferenceList = ({ onSelectConference }) => {
  const { conferences, registrations, currentUser } = useLD();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAudience, setSelectedAudience] = useState('All');

  const filteredConferences = conferences.filter(conf => {
    const matchesSearch = 
      conf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conf.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conf.speaker.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || conf.category === selectedCategory;
    const matchesAudience = selectedAudience === 'All' || conf.targetAudience.includes(selectedAudience);

    return matchesSearch && matchesCategory && matchesAudience;
  });

  const categories = ['All', ...new Set(conferences.map(c => c.category))];
  const audiences = ['All', 'Engineering', 'Leadership', 'Product', 'HR', 'All Employees'];

  const getFallbackImage = (id) => {
    switch (id) {
      case 'conf-1': return 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80';
      case 'conf-2': return 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80';
      case 'conf-3': return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80';
      default: return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Control Bar */}
      <div className="nielsen-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search conferences, speakers, topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-nielsen !pl-9 text-xs"
          />
        </div>

        {/* Category Pills & Audience */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 overflow-x-auto bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#0066cc] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#0066cc]" />
            <span className="text-slate-600 font-bold">Audience:</span>
            <select
              value={selectedAudience}
              onChange={e => setSelectedAudience(e.target.value)}
              className="bg-transparent text-slate-900 font-extrabold focus:outline-none cursor-pointer"
            >
              {audiences.map(aud => (
                <option key={aud} value={aud}>{aud}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Grid of Event Cards with Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredConferences.map(conf => {
          const isRegistered = registrations.some(r => r.conferenceId === conf.id && r.userEmail === currentUser.email);
          const percentFilled = Math.round((conf.registeredCount / conf.totalSeats) * 100);
          const isFillingFast = percentFilled >= 75;
          const seatsLeft = conf.totalSeats - conf.registeredCount;

          return (
            <div 
              key={conf.id}
              className="nielsen-card overflow-hidden flex flex-col justify-between hover:border-[#0066cc] transition-all duration-200 group relative border-t-4 border-t-[#0066cc]"
            >
              {/* Event Card Image */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img 
                  src={conf.image || getFallbackImage(conf.id)} 
                  alt={conf.title} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getFallbackImage(conf.id);
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded bg-[#001e42] text-white shadow-xs">
                    {conf.category}
                  </span>
                  {isFillingFast ? (
                    <span className="badge-nielsen badge-filling-fast shadow-xs">FILLING FAST 🔥</span>
                  ) : (
                    <span className="badge-nielsen badge-available shadow-xs">AVAILABLE</span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-extrabold text-[#001e42] text-lg leading-snug group-hover:text-[#0066cc] transition-colors">
                    {conf.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 font-medium">
                    {conf.subtitle}
                  </p>

                  <div className="flex items-center gap-1 flex-wrap pt-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mr-1">Target:</span>
                    {conf.targetAudience.map((aud, idx) => (
                      <span key={idx} className="badge-nielsen badge-target text-[10px]">
                        {aud}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Event Schedule Info */}
                <div className="space-y-1.5 text-xs text-slate-700 font-semibold pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#0066cc]" />
                    <span>{conf.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#0066cc]" />
                    <span>{conf.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#0066cc]" />
                    <span className="truncate">{conf.location}</span>
                  </div>
                </div>

                {/* Occupancy Progress */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Capacity Status</span>
                    <span>{conf.registeredCount} / {conf.totalSeats} (<span className="text-emerald-700">{seatsLeft} left</span>)</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill bg-[#0066cc]" style={{ width: `${percentFilled}%` }} />
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-1">
                  {isRegistered ? (
                    <button disabled className="w-full py-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-extrabold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Registered & Options Saved
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectConference(conf)}
                      className="w-full btn-nielsen-primary !py-2.5 text-xs justify-center"
                    >
                      <span>Register Now (Meal & Cab)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
