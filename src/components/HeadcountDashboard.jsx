import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { Users, CheckCircle2, Send, Filter, Clock, UserX, BarChart2, Award } from 'lucide-react';
import { AssessmentModal } from './AssessmentModal';
import { FeedbackModal } from './FeedbackModal';

export const HeadcountDashboard = ({ onOpenRegistrationModal }) => {
  const {
    conferences, registrations, currentUser,
    checkInAttendee, completeEventAutomations, markNonAttendance,
    getTotalLearningHours, toggleAssessment, assessmentResults, feedbackResponses
  } = useLD();

  const [selectedConfId, setSelectedConfId] = useState(conferences[0]?.id || '');
  const [assessmentModal, setAssessmentModal] = useState(null); // { conf, type }
  const [feedbackModal, setFeedbackModal] = useState(null);

  const currentConf = conferences.find(c => c.id === selectedConfId) || conferences[0];
  const confRegistrations = registrations.filter(r => r.conferenceId === selectedConfId);

  const totalSeats = currentConf?.totalSeats || 0;
  const registeredCount = currentConf?.registeredCount || 0;
  const checkedInCount = currentConf?.checkedInCount || 0;
  const seatsLeft = totalSeats - registeredCount;
  const pct = Math.round((registeredCount / totalSeats) * 100);
  const cabCount = confRegistrations.filter(r => r.needCab).length;

  const totalLearningHours = getTotalLearningHours();
  const confLearningHours = (currentConf?.durationHours || 0) * registeredCount;

  // Admin assessment toggle
  const canToggleAssessment = currentUser?.role === 'Admin' && currentConf?.hasAssessment;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Program Selector */}
      <div style={{
        background: 'var(--n-white)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--n-gray-border)', borderTop: '4px solid var(--n-navy)',
        padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16
      }}>
        <div>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 800, color: 'var(--n-blue)', marginBottom: 4 }}>
            Analytics & Roster Console
          </div>
          <h2 style={{ fontSize: 18, color: 'var(--n-navy-dark)', fontWeight: 800, margin: 0 }}>
            TLCE Program Headcount Report
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Filter size={16} color="var(--n-navy)" />
          <select
            className="form-input"
            value={selectedConfId}
            onChange={e => setSelectedConfId(e.target.value)}
            style={{ width: 320, fontWeight: 700, fontSize: 13 }}
          >
            {conferences.map(c => (
              <option key={c.id} value={c.id}>{c.title} ({c.registeredCount}/{c.totalSeats})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Global Total Learning Hours Banner */}
      <div style={{
        background: 'var(--grad-hero)', borderRadius: 'var(--radius-lg)',
        padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16
      }}>
        <Clock size={36} color="rgba(255,255,255,0.9)" />
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
            Platform-Wide Total Learning Hours
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#fff' }}>
            {totalLearningHours.toLocaleString()} hrs
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>
            Calculated as: Σ(Program Duration × Registered Participants) across all 12 TLCE programs
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>This Program</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{confLearningHours} hrs</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
            {currentConf?.durationHours}h × {registeredCount} participants
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
        {[
          { label: 'Total Seats', value: totalSeats, sub: 'Capacity', color: 'var(--n-navy)' },
          { label: 'Registered', value: registeredCount, sub: `${pct}% filled`, color: 'var(--n-blue)' },
          { label: 'Checked In', value: checkedInCount, sub: 'Attended', color: 'var(--n-success)' },
          { label: 'Seats Left', value: seatsLeft, sub: 'Available', color: seatsLeft === 0 ? 'var(--n-red)' : 'var(--n-success)' },
          { label: 'Cab Requests', value: cabCount, sub: 'Shuttles', color: '#7B2D8B' },
          { label: 'Waitlist', value: (currentConf?.waitlist || []).length, sub: 'Queued', color: 'var(--n-warning)' },
        ].map(m => (
          <div key={m.label} style={{
            background: 'var(--n-white)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--n-gray-border)', padding: '16px 18px'
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--n-gray-mid)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{m.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: m.color, marginTop: 4 }}>{m.value}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: m.color, marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Assessment Toggle (Admin only) */}
      {canToggleAssessment && (
        <div style={{
          background: 'var(--n-white)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--n-gray-border)', padding: '18px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
        }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--n-navy)', fontSize: 15 }}>📝 Assessment Control</div>
            <div style={{ fontSize: 12, color: 'var(--n-gray-mid)', marginTop: 3 }}>
              Enable or disable Pre/Post Assessment for this program. Currently:{' '}
              <strong style={{ color: currentConf.assessmentEnabled ? 'var(--n-success)' : 'var(--n-red)' }}>
                {currentConf.assessmentEnabled ? 'ENABLED' : 'DISABLED'}
              </strong>
            </div>
            <div style={{ fontSize: 12, color: 'var(--n-gray-mid)', marginTop: 4 }}>
              Results submitted: {assessmentResults.filter(r => r.conferenceId === selectedConfId).length} &nbsp;|&nbsp;
              Feedbacks: {feedbackResponses.filter(f => f.conferenceId === selectedConfId).length}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn btn-success btn-sm"
              onClick={() => toggleAssessment(selectedConfId, true)}
              disabled={currentConf.assessmentEnabled}
            >Enable</button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => toggleAssessment(selectedConfId, false)}
              disabled={!currentConf.assessmentEnabled}
            >Disable</button>
          </div>
        </div>
      )}

      {/* Admin Post-Event */}
      {currentUser?.role === 'Admin' && (
        <div style={{
          background: 'var(--n-white)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--n-gray-border)', padding: '18px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
        }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--n-navy)', fontSize: 15 }}>⚡ Post-Event Automations</div>
            <div style={{ fontSize: 12, color: 'var(--n-gray-mid)', marginTop: 3 }}>
              Mark event complete — triggers feedback requests for attendees and non-attendance alerts for absentees + their managers.
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => completeEventAutomations(selectedConfId)}>
            <Send size={15} /> Complete Event & Send All Emails
          </button>
        </div>
      )}

      {/* Attendee Roster Table */}
      <div style={{ background: 'var(--n-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--n-gray-border)', overflow: 'hidden' }}>
        <div style={{
          background: 'var(--grad-navy)', padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff' }}>
            <Users size={16} color="var(--n-blue-light)" />
            <span style={{ fontWeight: 800, fontSize: 14 }}>Live Attendee Roster & Actions</span>
          </div>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{confRegistrations.length} Registrations</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--n-gray-light)', borderBottom: '2px solid var(--n-gray-border)' }}>
                {['Participant', 'Email', 'Department', 'Meal', 'Shuttle', 'Status', 'Attendance', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: 'var(--n-gray-mid)', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {confRegistrations.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: 'var(--n-gray-mid)', fontWeight: 600 }}>No registrations for this program yet.</td></tr>
              ) : confRegistrations.map(reg => (
                <tr key={reg.id} style={{ borderBottom: '1px solid var(--n-gray-border)', transition: 'background 0.15s ease' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--n-gray-light)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--n-navy-dark)' }}>{reg.userName}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--n-gray-mid)', fontSize: 12 }}>{reg.userEmail}</td>
                  <td style={{ padding: '10px 14px' }}>{reg.department}</td>
                  <td style={{ padding: '10px 14px' }}>
                    {reg.mealPreference
                      ? <span className="badge badge-green">{reg.mealPreference === 'Veg' ? '🥗 Veg' : '🍗 Non-Veg'}</span>
                      : <span className="badge badge-gray">No Meal</span>}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {reg.needCab
                      ? <span style={{ fontSize: 12, color: '#7B2D8B', fontWeight: 600 }}>🚕 {reg.cabPickupLocation}</span>
                      : <span style={{ color: 'var(--n-gray-mid)', fontSize: 12 }}>No</span>}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {reg.checkedIn
                      ? <span className="badge badge-green"><CheckCircle2 size={10} /> Checked In</span>
                      : <span className="badge badge-gray">Pending</span>}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {reg.attended === false
                      ? <span className="badge badge-red">Absent</span>
                      : reg.attended === true
                      ? <span className="badge badge-green">Attended</span>
                      : <span className="badge badge-amber">—</span>}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {/* Check In */}
                      {!reg.checkedIn && currentUser?.role === 'Admin' && (
                        <button className="btn btn-success btn-sm" onClick={() => checkInAttendee(reg.id)} style={{ fontSize: 11 }}>
                          ✓ Check In
                        </button>
                      )}
                      {/* Mark Non-Attendance */}
                      {reg.checkedIn && reg.attended !== false && currentUser?.role === 'Admin' && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => markNonAttendance(reg.id)}
                          style={{ fontSize: 11 }}
                        >
                          <UserX size={11} /> Absent
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assessment Results Summary */}
      {assessmentResults.filter(r => r.conferenceId === selectedConfId).length > 0 && (
        <div style={{ background: 'var(--n-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--n-gray-border)', overflow: 'hidden' }}>
          <div style={{ background: 'var(--n-blue-pale)', padding: '14px 20px', borderBottom: '1px solid var(--n-gray-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Award size={16} color="var(--n-navy)" />
            <span style={{ fontWeight: 800, color: 'var(--n-navy)', fontSize: 14 }}>Assessment Results</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--n-gray-light)', borderBottom: '1px solid var(--n-gray-border)' }}>
                {['Participant', 'Type', 'Score', 'Result', 'Submitted'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: 'var(--n-gray-mid)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assessmentResults.filter(r => r.conferenceId === selectedConfId).map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--n-gray-border)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--n-navy-dark)' }}>{r.userName}</td>
                  <td style={{ padding: '10px 14px' }}><span className={`badge ${r.type === 'pre' ? 'badge-blue' : 'badge-navy'}`}>{r.type === 'pre' ? 'Pre' : 'Post'}</span></td>
                  <td style={{ padding: '10px 14px', fontWeight: 700 }}>{r.score}/{r.total} ({r.percentage}%)</td>
                  <td style={{ padding: '10px 14px' }}>
                    {r.cheating
                      ? <span className="badge badge-red">Cheating</span>
                      : r.passed
                      ? <span className="badge badge-green">Passed</span>
                      : <span className="badge badge-amber">Failed</span>}
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--n-gray-mid)', fontSize: 12 }}>{new Date(r.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assessment/Feedback Modals */}
      {assessmentModal && (
        <AssessmentModal
          conference={assessmentModal.conf}
          type={assessmentModal.type}
          onClose={() => setAssessmentModal(null)}
        />
      )}
      {feedbackModal && (
        <FeedbackModal
          conference={feedbackModal}
          onClose={() => setFeedbackModal(null)}
        />
      )}
    </div>
  );
};
