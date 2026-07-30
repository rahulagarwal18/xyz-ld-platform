import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ASSESSMENT_QUESTIONS } from '../data/initialData';
import { useLD } from '../context/LDContext';
import {
  AlertTriangle, CheckCircle, XCircle, Maximize, Shield, Clock,
  ChevronRight, RotateCcw, Award, Eye, EyeOff, Ban
} from 'lucide-react';

const STRIKE_LIMIT = 3;

export const AssessmentModal = ({ conference, type = 'pre', onClose }) => {
  const { currentUser, submitAssessment, dispatchEmail } = useLD();

  // Get questions by category
  const questions = ASSESSMENT_QUESTIONS[conference.category] || ASSESSMENT_QUESTIONS['default'];

  // State
  const [phase, setPhase] = useState('intro'); // intro | active | result | cheating
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [strikeWarning, setStrikeWarning] = useState(null);
  const [timeLeft, setTimeLeft] = useState(questions.length * 60); // 60 sec per question
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  // ── Fullscreen helpers ──────────────────────────────────────
  const enterFullscreen = useCallback(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
  }, []);

  const exitFullscreenAPI = useCallback(() => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }, []);

  const isFullscreen = () =>
    !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);

  // ── Cheating detector ───────────────────────────────────────
  const handleFullscreenChange = useCallback(() => {
    if (phase !== 'active') return;
    if (!isFullscreen()) {
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);

      if (newStrikes >= STRIKE_LIMIT) {
        // Auto-fail
        setPhase('cheating');
        exitFullscreenAPI();
        handleCheatSubmit();
        return;
      }

      if (newStrikes === STRIKE_LIMIT - 1) {
        setStrikeWarning(`⚠️ FINAL WARNING — One more violation and your test will be automatically failed as Cheating!`);
      } else {
        setStrikeWarning(`⚠️ Strike ${newStrikes}/${STRIKE_LIMIT}: Exiting fullscreen is a violation. Returning to fullscreen...`);
      }

      // Force back to fullscreen after 2 sec
      setTimeout(() => {
        enterFullscreen();
        setStrikeWarning(null);
      }, 2500);
    }
  }, [phase, strikes, enterFullscreen, exitFullscreenAPI]);

  // ── Timer ───────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'active') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true); // auto submit on timeout
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  // ── Fullscreen change listener ──────────────────────────────
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  // ── Block right-click, copy, cut, paste and selectstart during active ──
  useEffect(() => {
    if (phase !== 'active') return;
    const block = (e) => e.preventDefault();
    document.addEventListener('contextmenu', block);
    document.addEventListener('copy', block);
    document.addEventListener('cut', block);
    document.addEventListener('paste', block);
    document.addEventListener('selectstart', block);
    return () => {
      document.removeEventListener('contextmenu', block);
      document.removeEventListener('copy', block);
      document.removeEventListener('cut', block);
      document.removeEventListener('paste', block);
      document.removeEventListener('selectstart', block);
    };
  }, [phase]);

  // ── Cleanup on unmount ──────────────────────────────────────
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (isFullscreen()) exitFullscreenAPI();
    };
  }, []);

  // ── Handlers ────────────────────────────────────────────────
  const startTest = () => {
    enterFullscreen();
    setPhase('active');
    setTimeLeft(questions.length * 60);
  };

  const handleCheatSubmit = () => {
    clearInterval(timerRef.current);
    const cheatResult = {
      score: 0,
      total: questions.length,
      percentage: 0,
      passed: false,
      cheating: true,
      type
    };
    setResult(cheatResult);
    submitAssessment(conference.id, type, cheatResult, currentUser);
    // Email admin
    dispatchEmail({
      type: 'Alert',
      recipientEmail: 'admin@xyz.com',
      recipientName: 'L&D Admin',
      subject: `🚨 Cheating Alert: ${currentUser.name} — ${conference.title} (${type === 'pre' ? 'Pre' : 'Post'}-Assessment)`,
      preview: `${currentUser.name} exited fullscreen ${STRIKE_LIMIT} times during the assessment and was auto-failed.`,
      content: `<p><strong>${currentUser.name}</strong> (${currentUser.email}) was auto-failed for cheating in the <strong>${type === 'pre' ? 'Pre' : 'Post'}-Assessment</strong> of <em>${conference.title}</em> by exiting fullscreen ${STRIKE_LIMIT} times.</p>`,
      badgeColor: 'badge-red'
    });
  };

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (timeout = false) => {
    clearInterval(timerRef.current);
    if (submitted) return;
    setSubmitted(true);

    let score = 0;
    questions.forEach(q => {
      const ans = (answers[q.id] || '').trim().toLowerCase();
      const correct = q.answer.trim().toLowerCase();
      if (q.type === 'mcq' && ans === correct) score++;
      else if (q.type === 'one-word' && ans === correct) score++;
    });

    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 60;

    const res = { score, total: questions.length, percentage, passed, cheating: false, timeout, type };
    setResult(res);
    submitAssessment(conference.id, type, res, currentUser);
    exitFullscreenAPI();
    setPhase('result');
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // ── Intro Screen ────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="modal-container" style={{ maxWidth: 520 }}>
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Shield size={28} />
              <div>
                <div style={{ fontSize: 12, opacity: 0.75, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {type === 'pre' ? 'Pre-Program' : 'Post-Program'} Assessment
                </div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{conference.title}</div>
              </div>
            </div>
          </div>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              background: 'var(--n-blue-pale)', border: '1px solid rgba(0,156,222,0.3)',
              borderRadius: 'var(--radius-md)', padding: '16px 20px'
            }}>
              <div style={{ fontWeight: 700, color: 'var(--n-navy)', marginBottom: 8 }}>📋 Assessment Rules</div>
              <ul style={{ paddingLeft: 20, color: 'var(--n-gray-dark)', fontSize: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li><strong>{questions.length} questions</strong> — MCQ and One-Word answers</li>
                <li><strong>{questions.length} minutes</strong> total time limit</li>
                <li>Minimum <strong>60%</strong> score to pass</li>
                <li>The test will run in <strong>fullscreen mode</strong></li>
                <li>You cannot <strong>copy, paste, or right-click</strong></li>
                <li>Exiting fullscreen = <strong>strike (max 3)</strong></li>
                <li>3 strikes = <strong>auto-fail & admin notified</strong></li>
              </ul>
            </div>

            <div style={{
              background: 'var(--n-warning-bg)', border: '1px solid rgba(245,127,23,0.3)',
              borderRadius: 'var(--radius-md)', padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 10
            }}>
              <AlertTriangle size={20} color="var(--n-warning)" />
              <span style={{ fontSize: 13, color: '#7B4F00', fontWeight: 500 }}>
                Once you start, the timer begins immediately. Make sure you're ready.
              </span>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={startTest} style={{ gap: 8 }}>
              <Maximize size={16} /> Start Assessment in Fullscreen
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Cheating Screen ─────────────────────────────────────────
  if (phase === 'cheating') {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#1a0000', zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20
      }}>
        <Ban size={80} color="#CC0000" />
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, textAlign: 'center' }}>
          Assessment Failed — Cheating Detected
        </h1>
        <p style={{ color: '#ffaaaa', fontSize: 16, textAlign: 'center', maxWidth: 480, lineHeight: 1.6 }}>
          You exited fullscreen {STRIKE_LIMIT} times. Your attempt has been marked as <strong>FAILED</strong> and the L&D administrator has been notified.
        </p>
        <button className="btn btn-danger btn-lg" onClick={onClose} style={{ marginTop: 16 }}>
          Close & Exit
        </button>
      </div>
    );
  }

  // ── Active Assessment ────────────────────────────────────────
  if (phase === 'active') {
    const q = questions[currentQ];
    const progress = ((currentQ + 1) / questions.length) * 100;
    const timeColor = timeLeft < 60 ? 'var(--n-red)' : timeLeft < 180 ? 'var(--n-warning)' : 'var(--n-success)';

    return (
      <div className="assessment-fullscreen" ref={containerRef}>
        {/* Strike Warning Banner */}
        {strikeWarning && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10000,
            background: 'var(--n-red)', color: '#fff', padding: '14px 24px',
            display: 'flex', alignItems: 'center', gap: 12, fontWeight: 700, fontSize: 15,
            animation: 'slideDown 0.3s ease'
          }}>
            <AlertTriangle size={22} />
            {strikeWarning}
          </div>
        )}

        {/* Header */}
        <div style={{
          background: 'var(--grad-navy)', padding: '16px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ color: '#fff' }}>
            <div style={{ fontSize: 12, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }}>
              {type === 'pre' ? 'Pre-Program' : 'Post-Program'} Assessment
            </div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{conference.title}</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* Strikes */}
            <div style={{ color: '#fff', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[...Array(STRIKE_LIMIT)].map((_, i) => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: i < strikes ? 'var(--n-red)' : 'rgba(255,255,255,0.3)',
                  border: '1.5px solid rgba(255,255,255,0.5)'
                }} />
              ))}
              <span style={{ fontSize: 12, opacity: 0.8, marginLeft: 4 }}>
                {STRIKE_LIMIT - strikes} strikes left
              </span>
            </div>

            {/* Timer */}
            <div style={{
              background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-md)',
              padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8
            }}>
              <Clock size={16} color={timeColor} />
              <span style={{ color: timeColor, fontWeight: 800, fontSize: 20, fontFamily: 'monospace' }}>
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Progress */}
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>
              Q {currentQ + 1} / {questions.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: 4, background: 'rgba(0,48,135,0.15)' }}>
          <div style={{ height: '100%', background: 'var(--n-blue)', width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>

        {/* Question Body */}
        <div style={{
          maxWidth: 720, margin: '40px auto', padding: '0 32px',
          display: 'flex', flexDirection: 'column', gap: 28
        }}>
          {/* Question */}
          <div style={{
            background: 'var(--n-white)', borderRadius: 'var(--radius-lg)',
            padding: '28px 32px', boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--n-gray-border)'
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                minWidth: 36, height: 36, background: 'var(--n-navy)', color: '#fff',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 15
              }}>{currentQ + 1}</div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--n-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  {q.type === 'mcq' ? 'Multiple Choice' : 'One-Word Answer'}
                </div>
                <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--n-navy-dark)', lineHeight: 1.5 }}>{q.question}</p>
              </div>
            </div>
          </div>

          {/* Answer Options */}
          {q.type === 'mcq' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === opt;
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(q.id, opt)}
                    style={{
                      padding: '16px 20px', borderRadius: 'var(--radius-md)',
                      border: `2px solid ${selected ? 'var(--n-blue)' : 'var(--n-gray-border)'}`,
                      background: selected ? 'var(--n-blue-pale)' : 'var(--n-white)',
                      color: selected ? 'var(--n-navy)' : 'var(--n-gray-dark)',
                      fontWeight: selected ? 700 : 500, fontSize: 15, textAlign: 'left', cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex', alignItems: 'center', gap: 12
                    }}
                  >
                    <span style={{
                      minWidth: 28, height: 28, borderRadius: '50%',
                      border: `2px solid ${selected ? 'var(--n-blue)' : 'var(--n-gray-border)'}`,
                      background: selected ? 'var(--n-blue)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 800, color: selected ? '#fff' : 'var(--n-gray-mid)',
                      transition: 'all 0.15s ease'
                    }}>
                      {selected ? '✓' : String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <div>
              <label className="form-label">Your Answer (one word only):</label>
              <input
                className="form-input"
                type="text"
                placeholder="Type your one-word answer..."
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswer(q.id, e.target.value.split(' ')[0])}
                maxLength={30}
                autoComplete="off"
                autoFocus
                style={{ fontSize: 16, padding: '14px 18px' }}
              />
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
              disabled={currentQ === 0}
            >
              ← Previous
            </button>

            {currentQ < questions.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => setCurrentQ(currentQ + 1)}
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                className="btn btn-success btn-lg"
                onClick={() => handleSubmit()}
                style={{ background: 'var(--n-success)', color: '#fff', fontWeight: 700 }}
              >
                <CheckCircle size={18} /> Submit Assessment
              </button>
            )}
          </div>

          {/* Question dots */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: `2px solid ${i === currentQ ? 'var(--n-navy)' : answers[questions[i].id] ? 'var(--n-success)' : 'var(--n-gray-border)'}`,
                  background: i === currentQ ? 'var(--n-navy)' : answers[questions[i].id] ? 'var(--n-success-bg)' : 'transparent',
                  color: i === currentQ ? '#fff' : answers[questions[i].id] ? 'var(--n-success)' : 'var(--n-gray-mid)',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s ease'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Result Screen ────────────────────────────────────────────
  if (phase === 'result' && result) {
    const { score, total, percentage, passed, timeout } = result;
    return (
      <div className="modal-backdrop">
        <div className="modal-container animate-bounceIn" style={{ maxWidth: 500 }}>
          {/* Result Header */}
          <div style={{
            background: passed ? 'linear-gradient(135deg, var(--n-success), #43A047)' : 'var(--grad-red)',
            padding: '32px 28px', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
            textAlign: 'center', color: '#fff'
          }}>
            {passed
              ? <Award size={52} style={{ marginBottom: 12 }} />
              : <XCircle size={52} style={{ marginBottom: 12 }} />
            }
            <h2 style={{ color: '#fff', fontSize: 24, margin: 0 }}>
              {passed ? 'Assessment Passed! 🎉' : 'Assessment Not Passed'}
            </h2>
            {timeout && <p style={{ opacity: 0.8, marginTop: 4, fontSize: 13 }}>Time expired — auto submitted</p>}
          </div>

          <div className="modal-body" style={{ textAlign: 'center' }}>
            {/* Score Circle */}
            <div style={{
              width: 120, height: 120, borderRadius: '50%', margin: '0 auto 20px',
              background: passed ? 'var(--n-success-bg)' : 'var(--n-error-bg)',
              border: `4px solid ${passed ? 'var(--n-success)' : 'var(--n-red)'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: passed ? 'var(--n-success)' : 'var(--n-red)' }}>
                {percentage}%
              </span>
            </div>

            <p style={{ fontSize: 16, color: 'var(--n-gray-dark)', marginBottom: 8 }}>
              You answered <strong>{score}</strong> out of <strong>{total}</strong> questions correctly.
            </p>
            <p style={{ fontSize: 13, color: 'var(--n-gray-mid)' }}>
              Passing score: 60% &nbsp;|&nbsp; Your score: {percentage}%
              &nbsp;|&nbsp; Strikes: {strikes}/{STRIKE_LIMIT}
            </p>

            {/* Bar */}
            <div className="progress-bar" style={{ margin: '20px 0', height: 10 }}>
              <div className="progress-fill" style={{ width: `${percentage}%`, background: passed ? 'var(--n-success)' : 'var(--n-red)' }} />
            </div>

            {passed ? (
              <p style={{ fontSize: 14, color: 'var(--n-success)', fontWeight: 600 }}>
                ✅ Your result has been recorded. Great work!
              </p>
            ) : (
              <p style={{ fontSize: 14, color: 'var(--n-red)', fontWeight: 600 }}>
                You need 60% or higher to pass. Please review the program material and try again if allowed.
              </p>
            )}
          </div>

          <div className="modal-footer" style={{ justifyContent: 'center' }}>
            <button className="btn btn-primary btn-lg" onClick={onClose}>
              Close Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
