import React, { createContext, useContext, useState, useEffect } from 'react';
import { USERS as SEED_USERS, INITIAL_CONFERENCES, INITIAL_REGISTRATIONS, INITIAL_EMAILS, DEPARTMENT_MANAGERS } from '../data/initialData';
import confetti from 'canvas-confetti';

const LDContext = createContext();

// EmailJS Credentials
const EMAILJS_SERVICE_ID = 'service_ert6lhj';
const EMAILJS_TEMPLATE_ID = 'template_yz6asi8';
const EMAILJS_PUBLIC_KEY = 'ib1woyeUqWLxLdbFd';

export const LDProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('xyz_users');
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('xyz_current_user_id');
    if (saved === 'LOGGED_OUT') return null;
    const allUsers = JSON.parse(localStorage.getItem('xyz_users')) || SEED_USERS;
    return allUsers.find(u => u.id === saved) || allUsers[0];
  });

  const [conferences, setConferences] = useState(() => {
    const saved = localStorage.getItem('xyz_conferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(c => {
          const init = INITIAL_CONFERENCES.find(ic => ic.id === c.id);
          const validImg = init ? init.image : (c.image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85');
          return { ...c, image: validImg };
        });
      } catch (e) { return INITIAL_CONFERENCES; }
    }
    return INITIAL_CONFERENCES;
  });

  const [registrations, setRegistrations] = useState(() => {
    const saved = localStorage.getItem('xyz_registrations');
    return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
  });

  const [emails, setEmails] = useState(() => {
    const saved = localStorage.getItem('xyz_emails');
    return saved ? JSON.parse(saved) : INITIAL_EMAILS;
  });

  const [assessmentResults, setAssessmentResults] = useState(() => {
    const saved = localStorage.getItem('xyz_assessment_results');
    return saved ? JSON.parse(saved) : [];
  });

  const [feedbackResponses, setFeedbackResponses] = useState(() => {
    const saved = localStorage.getItem('xyz_feedback_responses');
    return saved ? JSON.parse(saved) : [];
  });

  const [notificationLog, setNotificationLog] = useState(() => {
    const saved = localStorage.getItem('xyz_notification_log');
    return saved ? JSON.parse(saved) : {};
  });

  const [groqApiKey] = useState(() => import.meta.env.VITE_GROQ_API_KEY || '');
  const [toast, setToast] = useState(null);

  // ── Persist to localStorage ──────────────────────────────────
  useEffect(() => { localStorage.setItem('xyz_users', JSON.stringify(users)); }, [users]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('xyz_current_user_id', currentUser.id);
    else localStorage.setItem('xyz_current_user_id', 'LOGGED_OUT');
  }, [currentUser]);
  useEffect(() => { localStorage.setItem('xyz_conferences', JSON.stringify(conferences)); }, [conferences]);
  useEffect(() => { localStorage.setItem('xyz_registrations', JSON.stringify(registrations)); }, [registrations]);
  useEffect(() => { localStorage.setItem('xyz_emails', JSON.stringify(emails)); }, [emails]);
  useEffect(() => { localStorage.setItem('xyz_assessment_results', JSON.stringify(assessmentResults)); }, [assessmentResults]);
  useEffect(() => { localStorage.setItem('xyz_feedback_responses', JSON.stringify(feedbackResponses)); }, [feedbackResponses]);
  useEffect(() => { localStorage.setItem('xyz_notification_log', JSON.stringify(notificationLog)); }, [notificationLog]);

  // ── Scheduled Notifications on App Load ─────────────────────
  useEffect(() => {
    if (!currentUser) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userRegs = registrations.filter(r => r.userEmail === currentUser.email);

    userRegs.forEach(reg => {
      const conf = conferences.find(c => c.id === reg.conferenceId);
      if (!conf || !conf.isoDate) return;

      const eventDate = new Date(conf.isoDate);
      eventDate.setHours(0, 0, 0, 0);
      const diffDays = Math.round((eventDate - today) / (1000 * 60 * 60 * 24));

      const sendNotif = (key, subject, preview, content) => {
        const notifKey = `${reg.id}_${key}`;
        if (notificationLog[notifKey]) return; // already sent
        setNotificationLog(prev => ({ ...prev, [notifKey]: true }));
        dispatchEmail({ type: 'Reminder', recipientEmail: currentUser.email, recipientName: currentUser.name, subject, preview, content, badgeColor: 'bg-amber-600' });
      };

      if (diffDays === 2) {
        sendNotif('2d', `🔔 Reminder: "${conf.title}" is in 2 days`, `Your session "${conf.title}" is on ${conf.date}. Please be prepared!`, `<p>Hi <strong>${currentUser.name}</strong>,</p><p>Your TLCE program <strong>${conf.title}</strong> is happening in <strong>2 days</strong> on <strong>${conf.date}</strong> at <strong>${conf.time}</strong>.</p><p>Please review the pre-materials and ensure your travel arrangements are ready.</p><p>xyz L&D Team</p>`);
      }
      if (diffDays === 1) {
        sendNotif('1d', `⏰ Tomorrow: "${conf.title}" — Final Reminder`, `"${conf.title}" is TOMORROW! Check location, meal, and arrive 15 min early.`, `<p>Hi <strong>${currentUser.name}</strong>,</p><p>Your TLCE program <strong>${conf.title}</strong> is <strong>TOMORROW</strong> — ${conf.date} at ${conf.time}.</p><p><strong>Location:</strong> ${conf.location}</p><p>Please arrive 15 minutes early for check-in.</p><p>xyz L&D Team</p>`);
      }
      if (diffDays === 0) {
        const hour = new Date().getHours();
        if (hour >= 6) {
          sendNotif('6am', `🌅 TODAY: "${conf.title}" — Event Day!`, `"${conf.title}" is TODAY! Get ready and head over!`, `<p>Hi <strong>${currentUser.name}</strong>,</p><p>Good morning! Your TLCE program <strong>${conf.title}</strong> is <strong>TODAY</strong> at ${conf.time}.</p><p><strong>Location:</strong> ${conf.location}</p><p>We are excited to see you! 🎉</p><p>xyz L&D Team</p>`);
        }
      }
    });
  }, [currentUser, registrations, conferences]); // eslint-disable-line

  // ── Toast ────────────────────────────────────────────────────
  const showToast = (message, type = 'info', action = null) => {
    setToast({ message, type, action, id: Date.now() });
    setTimeout(() => setToast(null), 6000);
  };

  // ── Email Dispatch ───────────────────────────────────────────
  const dispatchEmail = async ({ type, recipientEmail, recipientName, subject, preview, content, badgeColor = 'bg-[#003087]' }) => {
    const newEmail = {
      id: 'email-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type, recipientEmail, recipientName, subject, preview, content,
      timestamp: new Date().toISOString(), read: false, badgeColor
    };
    setEmails(prev => [newEmail, ...prev]);

    // EmailJS browser dispatch
    try {
      const emailjsRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            to_email: recipientEmail,
            email: recipientEmail,
            name: recipientName,
            to_name: recipientName,
            title: subject,
            subject: subject,
            message: preview || content,
            time: new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString()
          }
        })
      });
      if (emailjsRes.ok) {
        showToast(`📩 Email Delivered to ${recipientName}!`, 'success');
        return;
      }
    } catch (err) {
      console.log('EmailJS:', err.message);
    }

    // Fallback: Vercel API
    try {
      const apiEndpoint = window.location.hostname === 'localhost'
        ? 'http://localhost:5000/api/send-email'
        : '/api/send-email';
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: recipientEmail, recipientName, subject, html: content, type })
      });
      if (res.ok) {
        showToast(`📩 Email Dispatched to ${recipientName}!`, 'success');
      }
    } catch (e) {
      showToast(`📩 Email Logged to ${recipientName}!`, 'info');
    }
  };

  // ── Auth ─────────────────────────────────────────────────────
  const registerNewAccount = ({ name, email, password, department, role }) => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) { showToast('An account with this email already exists!', 'warning'); return { success: false }; }

    const newUser = {
      id: 'user_' + Date.now(), name, email,
      password: password || 'password123',
      role: role || 'Employee', department: department || 'Engineering',
      avatar: role === 'Admin' ? '👑' : '👤', targetCategory: department || 'All'
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);

    dispatchEmail({
      type: 'Broadcast', recipientEmail: email, recipientName: name,
      subject: '🎉 Welcome to xyz TLCE Platform!',
      preview: `Hello ${name}, your account is active. Explore our 2026 TLCE program calendar!`,
      badgeColor: 'bg-[#003087]',
      content: `<p>Hi <strong>${name}</strong>,</p><p>Your account has been created under <strong>${department}</strong> department.</p><p>Welcome to the xyz TLCE (Training, Learning, Conference & Engagement) platform!</p><p>xyz L&D Team</p>`
    });
    showToast(`Account created for ${name}! Logged in.`, 'success');
    return { success: true };
  };

  const loginUser = (email, password) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      const userName = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
      const isAdmin = email.toLowerCase().includes('admin');
      const autoUser = {
        id: 'user_' + Date.now(), name: userName || 'Employee Attendee', email,
        password: password || '123456', role: isAdmin ? 'Admin' : 'Employee',
        department: 'Engineering', avatar: isAdmin ? '👑' : '👤', targetCategory: 'Engineering'
      };
      setUsers(prev => [...prev, autoUser]);
      setCurrentUser(autoUser);
      showToast(`Welcome ${autoUser.name}! Signed in as ${autoUser.role}`, 'success');
      return { success: true };
    }
    setCurrentUser(found);
    showToast(`Welcome back, ${found.name}!`, 'success');
    return { success: true };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.setItem('xyz_current_user_id', 'LOGGED_OUT');
    showToast('You have been logged out.', 'info');
  };

  // ── Register for TLCE Program ────────────────────────────────
  const registerForConference = ({ conferenceId, userInfo, mealPreference, needCab, cabPickupLocation, cabPickupSlot }) => {
    const targetConf = conferences.find(c => c.id === conferenceId);
    if (!targetConf) return { success: false, message: 'Program not found' };

    const existing = registrations.find(r => r.conferenceId === conferenceId && r.userEmail === userInfo.email);
    if (existing) { showToast('You are already registered for this program!', 'warning'); return { success: false, message: 'Already registered' }; }

    const full = targetConf.registeredCount >= targetConf.totalSeats;

    // Seats full → suggest waitlist
    if (full) {
      showToast('This program is full. Use "Join Waitlist" to be notified if a seat opens.', 'warning');
      return { success: false, message: 'Seats full', suggestWaitlist: true };
    }

    const newReg = {
      id: 'reg-' + Date.now(),
      conferenceId, userId: userInfo.id || 'custom-user',
      userName: userInfo.name, userEmail: userInfo.email,
      department: userInfo.department || 'General',
      mealPreference: targetConf.hasMeal ? mealPreference : null,
      needCab, cabPickupLocation: needCab ? cabPickupLocation : 'N/A',
      cabPickupSlot: needCab ? cabPickupSlot : 'N/A',
      registeredAt: new Date().toISOString(),
      checkedIn: false, checkedInAt: null,
      attended: null, preAssessmentDone: false,
      postAssessmentDone: false, feedbackSubmitted: false
    };

    setRegistrations(prev => [newReg, ...prev]);
    setConferences(prev => prev.map(c => c.id === conferenceId ? { ...c, registeredCount: c.registeredCount + 1 } : c));

    try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch (e) {}

    const mealLine = targetConf.hasMeal ? `🍽️ Meal: ${mealPreference}` : 'No meal included for this event';
    const cabDetails = needCab ? `🚕 Shuttle: ${cabPickupLocation} (${cabPickupSlot})` : '🚕 Shuttle: Not Requested';

    dispatchEmail({
      type: 'Confirmation', recipientEmail: userInfo.email, recipientName: userInfo.name,
      subject: `✅ Registration Confirmed: ${targetConf.title}`,
      preview: `Your seat for ${targetConf.title} is confirmed! ${mealLine}`,
      badgeColor: 'bg-emerald-600',
      content: `<p>Dear <strong>${userInfo.name}</strong>,</p><p>Your registration for <strong>${targetConf.title}</strong> is confirmed.</p><p><strong>Date:</strong> ${targetConf.date} | ${targetConf.time}</p><p><strong>Location:</strong> ${targetConf.location}</p><p>${mealLine} | ${cabDetails}</p>${targetConf.hasAssessment ? '<p>📝 <strong>Note:</strong> This program has a Pre & Post Assessment. Please complete the Pre-Assessment before the event date.</p>' : ''}<p>xyz L&D Team</p>`
    });

    showToast(`✅ Registered for "${targetConf.title}"! Confirmation email sent.`, 'success');
    return { success: true };
  };

  // ── Waitlist ─────────────────────────────────────────────────
  const addToWaitlist = ({ conferenceId, userInfo }) => {
    const targetConf = conferences.find(c => c.id === conferenceId);
    if (!targetConf) return;

    const alreadyWaiting = (targetConf.waitlist || []).some(w => w.email === userInfo.email);
    if (alreadyWaiting) { showToast('You are already on the waitlist!', 'warning'); return; }

    setConferences(prev => prev.map(c =>
      c.id === conferenceId
        ? { ...c, waitlist: [...(c.waitlist || []), { name: userInfo.name, email: userInfo.email, addedAt: new Date().toISOString() }] }
        : c
    ));

    dispatchEmail({
      type: 'Waitlist', recipientEmail: userInfo.email, recipientName: userInfo.name,
      subject: `🔔 Waitlist Confirmed: ${targetConf.title}`,
      preview: `You're on the waitlist for ${targetConf.title}. We'll notify you if a seat opens.`,
      badgeColor: 'bg-amber-600',
      content: `<p>Hi <strong>${userInfo.name}</strong>,</p><p>You have been added to the waitlist for <strong>${targetConf.title}</strong> (${targetConf.date}).</p><p>You will receive an email notification immediately if a seat becomes available.</p><p>xyz L&D Team</p>`
    });

    showToast(`Added to waitlist for "${targetConf.title}". You'll be notified if a seat opens.`, 'success');
  };

  // ── Mark Non-Attendance → email participant + manager ────────
  const markNonAttendance = (registrationId) => {
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return;
    const conf = conferences.find(c => c.id === reg.conferenceId);
    const manager = DEPARTMENT_MANAGERS[reg.department] || DEPARTMENT_MANAGERS['All'];

    setRegistrations(prev => prev.map(r =>
      r.id === registrationId ? { ...r, attended: false } : r
    ));

    // Email to participant
    dispatchEmail({
      type: 'Absentee', recipientEmail: reg.userEmail, recipientName: reg.userName,
      subject: `📋 Attendance Marked: ${conf?.title} — Not Attended`,
      preview: `Your absence for ${conf?.title} has been recorded. Recordings will be available soon.`,
      badgeColor: 'bg-rose-600',
      content: `<p>Dear <strong>${reg.userName}</strong>,</p><p>Your non-attendance for <strong>${conf?.title}</strong> on <strong>${conf?.date}</strong> has been recorded in the xyz TLCE system.</p><p>Session recordings and slides will be available shortly on the L&D portal.</p><p>If you believe this is incorrect, please contact your L&D Administrator.</p><p>xyz L&D Team</p>`
    });

    // Email to manager
    setTimeout(() => {
      dispatchEmail({
        type: 'Manager Alert', recipientEmail: manager.email, recipientName: manager.name,
        subject: `⚠️ Non-Attendance Alert: ${reg.userName} — ${conf?.title}`,
        preview: `${reg.userName} (${reg.department}) did not attend ${conf?.title} on ${conf?.date}.`,
        badgeColor: 'bg-rose-800',
        content: `<p>Dear <strong>${manager.name}</strong>,</p><p>This is an automated notification from the xyz TLCE Learning Management System.</p><p><strong>${reg.userName}</strong> (${reg.department}) was registered for <strong>${conf?.title}</strong> on <strong>${conf?.date}</strong> but did not attend.</p><p>Please follow up with your team member as needed.</p><p>xyz L&D Administration</p>`
      });
    }, 800);

    showToast(`Non-attendance recorded for ${reg.userName}. Emails sent to participant & manager.`, 'warning');
  };

  // ── Check-In ─────────────────────────────────────────────────
  const checkInAttendee = (registrationId) => {
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return;
    if (reg.checkedIn) { showToast('Already checked in!', 'info'); return; }

    const conf = conferences.find(c => c.id === reg.conferenceId);
    const now = new Date().toISOString();

    setRegistrations(prev => prev.map(r => r.id === registrationId ? { ...r, checkedIn: true, checkedInAt: now, attended: true } : r));
    setConferences(prev => prev.map(c => c.id === reg.conferenceId ? { ...c, checkedInCount: c.checkedInCount + 1 } : c));

    dispatchEmail({
      type: 'Check-In', recipientEmail: reg.userEmail, recipientName: reg.userName,
      subject: `🎉 Welcome to ${conf?.title}! Check-in Successful`,
      preview: `You've checked in at ${new Date().toLocaleTimeString()}. Enjoy the session!`,
      badgeColor: 'bg-emerald-600',
      content: `<p>Welcome, <strong>${reg.userName}</strong>!</p><p>You've successfully checked into <strong>${conf?.title}</strong>.</p><p><strong>Check-in Time:</strong> ${new Date().toLocaleTimeString()}</p>${conf?.hasAssessment ? '<p>📝 Remember to complete your <strong>Post-Assessment</strong> after the session!</p>' : ''}<p>xyz L&D Team</p>`
    });

    showToast(`✅ Checked in ${reg.userName}!`, 'success');
  };

  // ── Assessment Submission ────────────────────────────────────
  const submitAssessment = (conferenceId, type, result, user) => {
    const resultRecord = {
      id: 'asmnt-' + Date.now(),
      conferenceId, type, userId: user.id,
      userName: user.name, userEmail: user.email,
      department: user.department,
      submittedAt: new Date().toISOString(),
      ...result
    };

    setAssessmentResults(prev => [...prev, resultRecord]);

    // Mark on registration
    setRegistrations(prev => prev.map(r =>
      r.conferenceId === conferenceId && r.userEmail === user.email
        ? { ...r, [type === 'pre' ? 'preAssessmentDone' : 'postAssessmentDone']: true }
        : r
    ));

    if (!result.cheating) {
      showToast(`Assessment submitted! Score: ${result.percentage}% (${result.passed ? 'PASSED ✅' : 'NOT PASSED ❌'})`, result.passed ? 'success' : 'warning');
    }
  };

  // ── Admin: Toggle Assessment for Event ───────────────────────
  const toggleAssessment = (conferenceId, enabled) => {
    setConferences(prev => prev.map(c =>
      c.id === conferenceId ? { ...c, assessmentEnabled: enabled } : c
    ));
    showToast(`Assessment ${enabled ? 'enabled' : 'disabled'} for this program.`, 'info');
  };

  // ── Feedback Submission ──────────────────────────────────────
  const submitFeedback = async (feedbackData) => {
    setFeedbackResponses(prev => [...prev, { id: 'fb-' + Date.now(), ...feedbackData }]);

    setRegistrations(prev => prev.map(r =>
      r.conferenceId === feedbackData.conferenceId && r.userEmail === feedbackData.participantEmail
        ? { ...r, feedbackSubmitted: true }
        : r
    ));

    // Email to admin with full feedback
    const ratingsHtml = Object.entries(feedbackData.ratings)
      .map(([k, v]) => `<li><strong>${k.charAt(0).toUpperCase() + k.slice(1)}:</strong> ${'★'.repeat(v)}${'☆'.repeat(5 - v)} (${v}/5)</li>`)
      .join('');

    await dispatchEmail({
      type: 'Feedback Response', recipientEmail: 'admin@xyz.com', recipientName: 'L&D Admin',
      subject: `📝 Feedback Received: ${feedbackData.conferenceTitle} — ${feedbackData.participantName}`,
      preview: `${feedbackData.participantName} rated ${feedbackData.conferenceTitle} — Avg: ${feedbackData.avgRating}/5`,
      badgeColor: 'bg-[#003087]',
      content: `<p><strong>${feedbackData.participantName}</strong> (${feedbackData.department}) submitted feedback for <strong>${feedbackData.conferenceTitle}</strong>.</p><p><strong>Avg Rating: ${feedbackData.avgRating}/5</strong></p><ul>${ratingsHtml}</ul><p><strong>Best Part:</strong> ${feedbackData.responses.bestPart}</p><p><strong>Improvement:</strong> ${feedbackData.responses.improvement || 'N/A'}</p><p><strong>Apply Learning:</strong> ${feedbackData.responses.applyLearning || 'N/A'}</p><p><strong>Recommend:</strong> ${feedbackData.responses.recommend || 'N/A'}</p><p><strong>Additional Comments:</strong> ${feedbackData.responses.additionalComments || 'N/A'}</p>`
    });

    showToast('Feedback submitted successfully! Thank you.', 'success');
  };

  // ── Complete Event (post-event automations) ──────────────────
  const completeEventAutomations = (conferenceId) => {
    const targetConf = conferences.find(c => c.id === conferenceId);
    if (!targetConf) return;

    const eventRegistrations = registrations.filter(r => r.conferenceId === conferenceId);
    if (eventRegistrations.length === 0) { showToast('No registrations found.', 'warning'); return; }

    setConferences(prev => prev.map(c => c.id === conferenceId ? { ...c, status: 'Completed' } : c));

    let delay = 0;
    eventRegistrations.forEach(reg => {
      delay += 600;
      if (reg.checkedIn) {
        setTimeout(() => {
          dispatchEmail({
            type: 'Feedback Request', recipientEmail: reg.userEmail, recipientName: reg.userName,
            subject: `📝 Share Your Feedback: "${targetConf.title}"`,
            preview: `Thank you for attending ${targetConf.title}! Please share your thoughts.`,
            badgeColor: 'bg-[#003087]',
            content: `<p>Hi <strong>${reg.userName}</strong>,</p><p>Thank you for attending <strong>${targetConf.title}</strong>! We'd love your feedback to improve future programs.</p><p>Please log in to the xyz TLCE platform to complete your post-assessment and submit feedback.</p><p>xyz L&D Team</p>`
          });
        }, delay);
      } else {
        // Auto mark non-attendance
        setTimeout(() => markNonAttendance(reg.id), delay);
      }
    });

    showToast(`Event completed! Post-event emails dispatched for ${eventRegistrations.length} participants.`, 'success');
  };

  // ── Add New TLCE Program ─────────────────────────────────────
  const addNewConference = (newConfData) => {
    const id = 'tlce-' + Date.now();
    const formattedConf = {
      id, ...newConfData, registeredCount: 0, checkedInCount: 0, status: 'Upcoming',
      bannerTag: newConfData.bannerTag || 'Special Program',
      image: newConfData.image || '/images/ai_mindset.jpg',
      hasMeal: newConfData.hasMeal || false,
      mealOptions: newConfData.hasMeal ? ['Veg', 'Non-Veg'] : [],
      hasAssessment: newConfData.hasAssessment || false,
      assessmentEnabled: newConfData.hasAssessment || false,
      durationHours: newConfData.durationHours || 2,
      waitlist: [],
      monthlyHighlight: newConfData.monthlyHighlight || newConfData.description
    };

    setConferences(prev => [formattedConf, ...prev]);

    dispatchEmail({
      type: 'Broadcast', recipientEmail: 'all-employees@xyz.com', recipientName: 'All Employees',
      subject: `✨ New TLCE Program: ${newConfData.title}`,
      preview: `A new TLCE program "${newConfData.title}" has been published! Register now.`,
      badgeColor: 'bg-[#003087]',
      content: `<p>Hello Team,</p><p>We're excited to announce a new TLCE program: <strong>${newConfData.title}</strong>.</p><p><strong>Date:</strong> ${newConfData.date} | ${newConfData.time}</p><p><strong>Speaker:</strong> ${newConfData.speaker}</p><p>Register now via the xyz TLCE portal!</p><p>xyz L&D Team</p>`
    });

    showToast(`Created TLCE program "${newConfData.title}"! Broadcast email sent.`, 'success');
  };

  // ── Computed: Total Learning Hours ───────────────────────────
  const getTotalLearningHours = () =>
    conferences.reduce((sum, c) => sum + (c.durationHours || 0) * c.registeredCount, 0);

  const getUserLearningHours = (userEmail) => {
    const userRegs = registrations.filter(r => r.userEmail === userEmail && r.attended === true);
    return userRegs.reduce((sum, r) => {
      const conf = conferences.find(c => c.id === r.conferenceId);
      return sum + (conf?.durationHours || 0);
    }, 0);
  };

  const markEmailRead = (emailId) => {
    setEmails(prev => prev.map(e => e.id === emailId ? { ...e, read: true } : e));
  };

  return (
    <LDContext.Provider value={{
      USERS: users,
      currentUser, setCurrentUser,
      conferences, registrations, emails,
      assessmentResults, feedbackResponses,
      groqApiKey, toast,
      showToast, dispatchEmail,
      registerNewAccount, loginUser, logoutUser,
      registerForConference, addToWaitlist,
      checkInAttendee, markNonAttendance,
      completeEventAutomations, addNewConference,
      submitAssessment, toggleAssessment,
      submitFeedback, markEmailRead,
      getTotalLearningHours, getUserLearningHours
    }}>
      {children}
    </LDContext.Provider>
  );
};

export const useLD = () => useContext(LDContext);
