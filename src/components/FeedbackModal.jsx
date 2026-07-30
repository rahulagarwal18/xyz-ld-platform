import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { Star, Send, CheckCircle, MessageSquare, ThumbsUp } from 'lucide-react';

const StarInput = ({ value, onChange, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label className="form-label">{label}</label>
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          style={{
            fontSize: 28, background: 'none', border: 'none', cursor: 'pointer',
            color: n <= value ? '#F59E0B' : '#D1D5DB',
            transform: n <= value ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.15s ease'
          }}
        >★</button>
      ))}
      {value > 0 && (
        <span style={{ fontSize: 12, color: 'var(--n-gray-mid)', alignSelf: 'center', marginLeft: 4 }}>
          {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value]}
        </span>
      )}
    </div>
  </div>
);

export const FeedbackModal = ({ conference, onClose }) => {
  const { currentUser, submitFeedback } = useLD();

  const [ratings, setRatings] = useState({ overall: 0, speaker: 0, content: 0, logistics: 0 });
  const [responses, setResponses] = useState({
    bestPart: '',
    improvement: '',
    applyLearning: '',
    recommend: '',
    additionalComments: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid =
    ratings.overall > 0 && ratings.speaker > 0 && ratings.content > 0 && ratings.logistics > 0 &&
    responses.bestPart.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);

    const feedbackData = {
      conferenceId: conference.id,
      conferenceTitle: conference.title,
      participantName: currentUser.name,
      participantEmail: currentUser.email,
      department: currentUser.department,
      submittedAt: new Date().toISOString(),
      ratings,
      responses,
      avgRating: ((ratings.overall + ratings.speaker + ratings.content + ratings.logistics) / 4).toFixed(1)
    };

    await submitFeedback(feedbackData);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="modal-backdrop">
        <div className="modal-container animate-bounceIn" style={{ maxWidth: 440 }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--n-success), #43A047)',
            padding: '40px 28px', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
            textAlign: 'center', color: '#fff'
          }}>
            <CheckCircle size={60} style={{ marginBottom: 12 }} />
            <h2 style={{ color: '#fff', fontSize: 22, margin: 0 }}>Thank You! 🎉</h2>
            <p style={{ opacity: 0.85, marginTop: 8, fontSize: 14 }}>
              Your feedback has been submitted and shared with the L&D team.
            </p>
          </div>
          <div className="modal-body" style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--n-success-bg)', padding: '12px 20px', borderRadius: 'var(--radius-md)',
              color: 'var(--n-success)', fontWeight: 600, fontSize: 14
            }}>
              <ThumbsUp size={18} />
              Your response has been recorded for <strong style={{ marginLeft: 4 }}>{conference.title}</strong>
            </div>
          </div>
          <div className="modal-footer" style={{ justifyContent: 'center' }}>
            <button className="btn btn-primary btn-lg" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-container" style={{ maxWidth: 620, maxHeight: '92vh' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <MessageSquare size={26} />
            <div>
              <div style={{ fontSize: 11, opacity: 0.75, textTransform: 'uppercase', letterSpacing: 1 }}>
                Program Feedback Form
              </div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{conference.title}</div>
            </div>
          </div>
          <p style={{ opacity: 0.75, fontSize: 13, marginTop: 8 }}>
            Your feedback helps us improve every TLCE program. Please be honest and detailed.
          </p>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Star Ratings */}
          <div style={{
            background: 'var(--n-gray-light)', borderRadius: 'var(--radius-md)', padding: '20px',
            display: 'flex', flexDirection: 'column', gap: 16
          }}>
            <div style={{ fontWeight: 700, color: 'var(--n-navy)', fontSize: 14, marginBottom: -4 }}>
              ⭐ Rate Your Experience
            </div>
            <StarInput label="Overall Program Experience" value={ratings.overall} onChange={v => setRatings(p => ({ ...p, overall: v }))} />
            <StarInput label="Speaker / Facilitator Quality" value={ratings.speaker} onChange={v => setRatings(p => ({ ...p, speaker: v }))} />
            <StarInput label="Content Relevance & Quality" value={ratings.content} onChange={v => setRatings(p => ({ ...p, content: v }))} />
            <StarInput label="Logistics (Venue / Tech / Timing)" value={ratings.logistics} onChange={v => setRatings(p => ({ ...p, logistics: v }))} />
          </div>

          {/* Open-Ended */}
          <div className="form-group">
            <label className="form-label">What was the best part of this program? *</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Share what you found most valuable..."
              value={responses.bestPart}
              onChange={e => setResponses(p => ({ ...p, bestPart: e.target.value }))}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">What could be improved?</label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Any suggestions for improvement..."
              value={responses.improvement}
              onChange={e => setResponses(p => ({ ...p, improvement: e.target.value }))}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">How will you apply this learning in your work?</label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Describe how you'll use what you learned..."
              value={responses.applyLearning}
              onChange={e => setResponses(p => ({ ...p, applyLearning: e.target.value }))}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Would you recommend this program to a colleague?</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['Definitely Yes', 'Probably Yes', 'Not Sure', 'Probably No'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setResponses(p => ({ ...p, recommend: opt }))}
                  style={{
                    padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: 12, fontWeight: 600,
                    border: `2px solid ${responses.recommend === opt ? 'var(--n-blue)' : 'var(--n-gray-border)'}`,
                    background: responses.recommend === opt ? 'var(--n-blue-pale)' : 'var(--n-white)',
                    color: responses.recommend === opt ? 'var(--n-navy)' : 'var(--n-gray-mid)',
                    cursor: 'pointer', transition: 'all 0.15s ease'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Additional Comments</label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Any other thoughts..."
              value={responses.additionalComments}
              onChange={e => setResponses(p => ({ ...p, additionalComments: e.target.value }))}
              style={{ resize: 'vertical' }}
            />
          </div>

          {!isValid && (
            <div style={{
              background: 'var(--n-warning-bg)', border: '1px solid rgba(245,127,23,0.3)',
              borderRadius: 'var(--radius-md)', padding: '10px 16px', fontSize: 13, color: '#7B4F00'
            }}>
              ⚠️ Please fill all star ratings and the "Best Part" field to submit.
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <><span className="animate-spin" style={{ display: 'inline-block', marginRight: 8 }}>⟳</span> Submitting...</>
            ) : (
              <><Send size={16} /> Submit Feedback</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
