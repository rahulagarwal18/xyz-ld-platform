import React, { useState, useEffect } from 'react';
import { useLD } from '../context/LDContext';
import { ArrowRight, Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Award } from 'lucide-react';

export const BannerCarousel = ({ onSelectConference }) => {
  const { conferences } = useLD();
  const [activeIndex, setActiveIndex] = useState(0);

  // Get the 3 mandatory conferences
  const bannerConfs = [
    conferences.find(c => c.id === 'conf-1') || conferences[0],
    conferences.find(c => c.id === 'conf-2') || conferences[1],
    conferences.find(c => c.id === 'conf-3') || conferences[2]
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % bannerConfs.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [bannerConfs.length]);

  const currentConf = bannerConfs[activeIndex];

  const getFallbackImage = (id) => {
    switch (id) {
      case 'conf-1': return 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80';
      case 'conf-2': return 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80';
      case 'conf-3': return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80';
      default: return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
    }
  };

  return (
    <div className="nielsen-card bg-white p-6 md:p-8 my-6 relative overflow-hidden border-t-4 border-t-[#0066cc]">
      
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-8">
        
        {/* Left Event Details */}
        <div className="space-y-4 flex-1 flex flex-col justify-center">
          
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded bg-[#001e42] text-white text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-xs">
              <Award className="w-3.5 h-3.5 text-[#00a3e0]" />
              {currentConf.bannerTag}
            </span>
            <span className="text-xs font-bold text-slate-500">
              Featured Conference {activeIndex + 1} of 3
            </span>
          </div>

          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#001e42] tracking-tight">
              {currentConf.title}
            </h2>
            <p className="text-sm font-medium text-slate-600 mt-1 max-w-xl leading-relaxed">
              {currentConf.subtitle}
            </p>
          </div>

          {/* Key Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700 pt-1">
            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-[#0066cc]" /> {currentConf.date}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-[#0066cc]" /> {currentConf.time}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-[#0066cc]" /> {currentConf.location}
            </span>
          </div>

          {/* Target Audience */}
          <div className="flex items-center gap-2 text-xs pt-1">
            <span className="text-slate-500 font-bold uppercase tracking-wider">Target Audience:</span>
            <div className="flex flex-wrap gap-1.5">
              {currentConf.targetAudience.map((aud, idx) => (
                <span key={idx} className="badge-nielsen badge-target">
                  {aud}
                </span>
              ))}
            </div>
          </div>

          {/* CTA & Occupancy status */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onSelectConference(currentConf)}
              className="btn-nielsen-primary !px-6 !py-2.5 text-xs shadow-md"
            >
              <span>Register & Request Options</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-xs text-slate-600 font-semibold">
              <span className="text-emerald-700 font-extrabold">{currentConf.totalSeats - currentConf.registeredCount} seats left</span> out of {currentConf.totalSeats} capacity
            </div>
          </div>

        </div>

        {/* Right Event Banner Image Showcase */}
        <div className="lg:w-96 relative group rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 min-h-[220px]">
          <img 
            src={currentConf.image || getFallbackImage(currentConf.id)} 
            alt={currentConf.title} 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = getFallbackImage(currentConf.id);
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001e42]/85 via-transparent to-transparent p-4 flex flex-col justify-end text-white">
            <div className="text-[10px] uppercase font-bold text-[#00a3e0] tracking-wider">Speaker Keynote</div>
            <div className="text-sm font-extrabold drop-shadow-sm">{currentConf.speaker}</div>
          </div>
        </div>

      </div>

      {/* Navigation Slider Bar */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-6">
        <div className="flex gap-2">
          {bannerConfs.map((conf, idx) => (
            <button
              key={conf.id}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                activeIndex === idx ? 'w-8 bg-[#0066cc]' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              title={conf.title}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveIndex((activeIndex - 1 + bannerConfs.length) % bannerConfs.length)}
            className="p-1.5 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveIndex((activeIndex + 1) % bannerConfs.length)}
            className="p-1.5 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
