import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { X, Star, Send, CheckCircle2 } from 'lucide-react';

export const FeedbackModal = ({ isOpen, onClose, conferenceTitle }) => {
  const { showToast } = useLD();
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast(`Thank you! Your feedback for "${conferenceTitle}" has been submitted.`, 'success');
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 bg-white border border-slate-200 border-t-4 border-t-[#0066cc]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-extrabold text-[#001e42]">
              Post-Conference Feedback Survey
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              xyz Learning and Devlopemnt department
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3 animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-extrabold text-slate-900 text-base">Feedback Submitted!</h4>
            <p className="text-xs text-slate-600 font-medium">Thank you for helping us elevate L&D programs at xyz.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 my-4">
            <div>
              <label className="form-label-nielsen">Event Title</label>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-extrabold text-[#001e42]">
                {conferenceTitle || 'AI Ready Mindset'}
              </div>
            </div>

            <div>
              <label className="form-label-nielsen">Overall Rating</label>
              <div className="flex gap-2 my-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                  >
                    {star <= rating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label-nielsen">Key Learnings & Comments</label>
              <textarea
                rows="3"
                placeholder="What did you enjoy most about this conference?"
                value={comments}
                onChange={e => setComments(e.target.value)}
                className="input-nielsen text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
              <button type="button" onClick={onClose} className="btn-nielsen-secondary text-xs">
                Cancel
              </button>
              <button type="submit" className="btn-nielsen-primary text-xs">
                <Send className="w-3.5 h-3.5" /> Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
