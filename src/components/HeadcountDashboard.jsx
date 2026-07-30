import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { Users, CheckCircle2, UserX, Send, AlertTriangle, Sparkles, Filter, ChevronRight } from 'lucide-react';

export const HeadcountDashboard = ({ onOpenRegistrationModal }) => {
  const { conferences, registrations, checkInAttendee, completeEventAutomations, dispatchBulkEmails, currentUser } = useLD();
  const [selectedConfId, setSelectedConfId] = useState(conferences[0]?.id || 'conf-1');

  const currentConf = conferences.find(c => c.id === selectedConfId) || conferences[0];
  const confRegistrations = registrations.filter(r => r.conferenceId === selectedConfId);

  const totalSeats = currentConf ? currentConf.totalSeats : 100;
  const registeredCount = currentConf ? currentConf.registeredCount : 0;
  const checkedInCount = currentConf ? currentConf.checkedInCount : 0;
  const seatsLeft = totalSeats - registeredCount;
  const percentFilled = Math.round((registeredCount / totalSeats) * 100);
  const isFillingFast = percentFilled >= 75;

  const cabRequestsCount = confRegistrations.filter(r => r.needCab).length;

  return (
    <div className="space-y-6">
      
      {/* Event Selection Selector */}
      <div className="nielsen-card p-5 bg-white border border-slate-200 border-t-4 border-t-[#0066cc] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#00a3e0] bg-[#001e42] px-2.5 py-1 rounded">
            Headcount Report Analysis Console
          </span>
          <h2 className="text-xl font-extrabold text-[#001e42] mt-2">
            Select Conference for Live Headcount Breakdown
          </h2>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-[#0066cc]" />
          <select
            value={selectedConfId}
            onChange={e => setSelectedConfId(e.target.value)}
            className="input-nielsen text-xs font-extrabold cursor-pointer md:w-80"
          >
            {conferences.map(conf => (
              <option key={conf.id} value={conf.id}>
                {conf.title} ({conf.registeredCount}/{conf.totalSeats} seats)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Capacity */}
        <div className="nielsen-card p-4 bg-white border border-slate-200">
          <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Seats</div>
          <div className="text-2xl lg:text-3xl font-black text-[#001e42] mt-1">{totalSeats}</div>
          <div className="text-[10px] font-bold text-slate-400 mt-1">Capacity Limit</div>
        </div>

        {/* Seats Registered */}
        <div className="nielsen-card p-4 bg-white border border-slate-200">
          <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Seats Filled</div>
          <div className="text-2xl lg:text-3xl font-black text-[#0066cc] mt-1">{registeredCount}</div>
          <div className="text-[10px] font-extrabold text-[#0066cc] mt-1">{percentFilled}% Occupancy</div>
        </div>

        {/* Seats Left */}
        <div className="nielsen-card p-4 bg-white border border-slate-200">
          <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Seats Available</div>
          <div className="text-2xl lg:text-3xl font-black text-emerald-700 mt-1">{seatsLeft}</div>
          <div className="text-[10px] font-extrabold text-emerald-700 mt-1">First-Come Basis</div>
        </div>

        {/* Filling Fast Alert Status */}
        <div className="nielsen-card p-4 bg-white border border-slate-200">
          <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Pacing Status</div>
          <div className="mt-2">
            {isFillingFast ? (
              <span className="badge-nielsen badge-filling-fast text-xs shadow-xs">FILLING FAST 🔥</span>
            ) : (
              <span className="badge-nielsen badge-available text-xs shadow-xs">NORMAL PACE</span>
            )}
          </div>
          <div className="text-[10px] font-bold text-slate-500 mt-2">{percentFilled}% Filled</div>
        </div>

        {/* Cab Requests */}
        <div className="nielsen-card p-4 bg-white border border-slate-200 col-span-2 lg:col-span-1">
          <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Cab Requests</div>
          <div className="text-2xl lg:text-3xl font-black text-purple-700 mt-1">{cabRequestsCount}</div>
          <div className="text-[10px] font-extrabold text-purple-700 mt-1">Shuttle Service</div>
        </div>

      </div>

      {/* Target Audience & Bulk Email Controls */}
      <div className="nielsen-card p-6 bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="space-y-2">
          <div className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
            Target Audience Tagging
          </div>
          <div className="flex flex-wrap gap-2">
            {currentConf?.targetAudience.map((aud, idx) => (
              <span key={idx} className="badge-nielsen badge-target text-xs">
                {aud}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-600 font-medium pt-1">
            Automated notifications dispatched to matching target audience profiles.
          </p>
        </div>

        {/* 1000+ Bulk Email Broadcast Action Button */}
        {currentUser?.role === 'Admin' && (
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => {
                dispatchBulkEmails({
                  conferenceTitle: currentConf.title,
                  subject: `📢 Urgent Conference Broadcast: ${currentConf.title}`,
                  html: `<h2>xyz Learning & Development</h2><p>Announcement for ${currentConf.title}.</p>`,
                  totalAttendees: 1000
                });
              }}
              className="btn-nielsen-primary !py-3 !px-5 text-xs shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Bulk Email 1000+ Attendees</span>
            </button>

            <button
              onClick={() => completeEventAutomations(selectedConfId)}
              className="btn-nielsen-secondary !py-3 text-xs"
            >
              <Send className="w-4 h-4 text-[#0066cc]" />
              <span>Fulfill Post-Event Automations</span>
            </button>
          </div>
        )}

      </div>

      {/* Attendee Roster Table */}
      <div className="nielsen-card bg-white border border-slate-200 overflow-hidden">
        <div className="p-4 bg-[#001e42] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#00a3e0]" />
            <h3 className="font-extrabold text-sm">
              Live Attendee Roster & Check-In Console
            </h3>
          </div>
          <span className="text-xs text-slate-300 font-semibold">
            {confRegistrations.length} Total Registrations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Attendee Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Department</th>
                <th className="p-3">Meal Preference</th>
                <th className="p-3">Shuttle Cab</th>
                <th className="p-3">Check-In Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {confRegistrations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500 font-semibold">
                    No registrations recorded for this conference yet.
                  </td>
                </tr>
              ) : (
                confRegistrations.map(reg => (
                  <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-extrabold text-[#001e42]">{reg.userName}</td>
                    <td className="p-3 text-slate-600">{reg.userEmail}</td>
                    <td className="p-3">{reg.department}</td>
                    <td className="p-3 font-semibold">{reg.mealPreference}</td>
                    <td className="p-3">
                      {reg.needCab ? (
                        <span className="text-purple-700 font-bold">
                          🚕 {reg.cabPickupLocation}
                        </span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className="p-3">
                      {reg.checkedIn ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Checked In
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                          Pending Arrival
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {!reg.checkedIn ? (
                        <button
                          onClick={() => checkInAttendee(reg.id)}
                          className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] shadow-xs"
                        >
                          Check In & Send Mail
                        </button>
                      ) : (
                        <span className="text-slate-400 font-semibold text-[11px]">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
