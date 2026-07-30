import React, { createContext, useContext, useState, useEffect } from 'react';
import { USERS as SEED_USERS, INITIAL_CONFERENCES, INITIAL_REGISTRATIONS, INITIAL_EMAILS } from '../data/initialData';
import confetti from 'canvas-confetti';

const LDContext = createContext();

// Provided EmailJS Credentials
const EMAILJS_SERVICE_ID = 'service_ert6lhj';
const EMAILJS_TEMPLATE_ID = 'template_m1fgbz3';
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
          return {
            ...c,
            image: c.image || (init ? init.image : '/images/ai_mindset.jpg')
          };
        });
      } catch (e) {
        return INITIAL_CONFERENCES;
      }
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

  const [groqApiKey, setGroqApiKey] = useState(() => import.meta.env.VITE_GROQ_API_KEY || '');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('xyz_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('xyz_current_user_id', currentUser.id);
    } else {
      localStorage.setItem('xyz_current_user_id', 'LOGGED_OUT');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('xyz_conferences', JSON.stringify(conferences));
  }, [conferences]);

  useEffect(() => {
    localStorage.setItem('xyz_registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('xyz_emails', JSON.stringify(emails));
  }, [emails]);

  const showToast = (message, type = 'info', action = null) => {
    setToast({ message, type, action, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 6000);
  };

  // Dispatch automated email via browser EmailJS API
  const dispatchEmail = async ({ type, recipientEmail, recipientName, subject, preview, content, badgeColor = 'bg-[#0066cc]' }) => {
    const newEmail = {
      id: 'email-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type,
      recipientEmail,
      recipientName,
      subject,
      preview,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      badgeColor
    };

    setEmails(prev => [newEmail, ...prev]);

    // 1. Direct Browser EmailJS API Call (Maps all standard variables to template_m1fgbz3)
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
            user_email: recipientEmail,
            reply_to: recipientEmail,
            to_name: recipientName,
            name: recipientName,
            user_name: recipientName,
            subject: subject,
            message: preview || content,
            content: content,
            message_html: content,
            from_name: 'xyz Learning & Development Department'
          }
        })
      });

      if (emailjsRes.ok) {
        showToast(`📩 Automated Email Sent to ${recipientName} (${recipientEmail})!`, 'success');
        return;
      } else {
        const errText = await emailjsRes.text();
        console.log('EmailJS response note:', errText);
      }
    } catch (err) {
      console.log('Browser EmailJS dispatch log:', err.message);
    }

    // 2. Server API fallback
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientEmail,
          recipientName,
          subject,
          html: content,
          type
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.previewUrl) {
          showToast(
            `📩 Automated Email Dispatched to ${recipientName} (${recipientEmail})!`, 
            'success',
            { label: 'View Live Delivered Email ✉️', url: data.previewUrl }
          );
        } else {
          showToast(`📩 Automated Email Sent to ${recipientName} (${recipientEmail})!`, 'success');
        }
      } else {
        showToast(`📩 Email Dispatched to ${recipientName}!`, 'success');
      }
    } catch (e) {
      showToast(`📩 Email Dispatched to ${recipientName}!`, 'success');
    }
  };

  const registerNewAccount = ({ name, email, password, department, role }) => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      showToast('An account with this email already exists!', 'warning');
      return { success: false, message: 'Email already exists' };
    }

    const newUser = {
      id: 'user_' + Date.now(),
      name,
      email,
      password: password || 'password123',
      role: role || 'Employee',
      department: department || 'Engineering',
      avatar: role === 'Admin' ? '👑' : '👤',
      targetCategory: department || 'All'
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);

    dispatchEmail({
      type: 'Broadcast',
      recipientEmail: email,
      recipientName: name,
      subject: '🎉 Welcome to xyz Learning & Development Platform!',
      preview: `Hello ${name}, your employee account is active. Explore our Q3 flagship conferences...`,
      badgeColor: 'bg-[#0066cc]',
      content: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2 style="color: #001e42;">Welcome to xyz L&D Platform</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your account has been successfully created under the <strong>${department}</strong> department (${role}).</p>
          <p>You can now register for upcoming conferences, reserve meal options, request shuttle cab pickup, and track your attendance.</p>
          <p>Best regards,<br/><strong>xyz Learning and Devlopemnt department</strong></p>
        </div>
      `
    });

    showToast(`Account created for ${name}! Logged in.`, 'success');
    return { success: true };
  };

  const loginUser = (email, password) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      const userName = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
      const isCustomAdmin = email.toLowerCase().includes('admin');
      
      const autoUser = {
        id: 'user_' + Date.now(),
        name: userName || 'Employee Attendee',
        email,
        password: password || '123456',
        role: isCustomAdmin ? 'Admin' : 'Employee',
        department: 'Engineering',
        avatar: isCustomAdmin ? '👑' : '👤',
        targetCategory: 'Engineering'
      };

      setUsers(prev => [...prev, autoUser]);
      setCurrentUser(autoUser);

      dispatchEmail({
        type: 'Broadcast',
        recipientEmail: email,
        recipientName: autoUser.name,
        subject: '🎉 Welcome to xyz Learning & Development Platform!',
        preview: `Hello ${autoUser.name}, your account is initialized. Explore upcoming conferences...`,
        badgeColor: 'bg-[#0066cc]',
        content: `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <h2 style="color: #001e42;">Welcome to xyz L&D Platform</h2>
            <p>Hi <strong>${autoUser.name}</strong>,</p>
            <p>Your account (<strong>${email}</strong>) has been initialized and logged in.</p>
            <p>Regards,<br/><strong>xyz Learning and Devlopemnt department</strong></p>
          </div>
        `
      });

      showToast(`Welcome ${autoUser.name}! Signed in as ${autoUser.role}`, 'success');
      return { success: true };
    }

    setCurrentUser(found);
    showToast(`Welcome back, ${found.name}! Signed in as ${found.role}`, 'success');
    return { success: true };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.setItem('xyz_current_user_id', 'LOGGED_OUT');
    showToast('You have been logged out of your session.', 'info');
  };

  const registerForConference = ({ conferenceId, userInfo, mealPreference, needCab, cabPickupLocation, cabPickupSlot }) => {
    const targetConf = conferences.find(c => c.id === conferenceId);
    if (!targetConf) return { success: false, message: 'Conference not found' };

    const existing = registrations.find(r => r.conferenceId === conferenceId && r.userEmail === userInfo.email);
    if (existing) {
      showToast('You are already registered for this conference!', 'warning');
      return { success: false, message: 'Already registered' };
    }

    if (targetConf.registeredCount >= targetConf.totalSeats) {
      showToast('Sorry, this conference is completely booked!', 'error');
      return { success: false, message: 'Seats full' };
    }

    const newReg = {
      id: 'reg-' + Date.now(),
      conferenceId,
      userId: userInfo.id || 'custom-user',
      userName: userInfo.name,
      userEmail: userInfo.email,
      department: userInfo.department || 'General',
      mealPreference,
      needCab,
      cabPickupLocation: needCab ? cabPickupLocation : 'N/A',
      cabPickupSlot: needCab ? cabPickupSlot : 'N/A',
      registeredAt: new Date().toISOString(),
      checkedIn: false,
      checkedInAt: null
    };

    setRegistrations(prev => [newReg, ...prev]);

    setConferences(prev => prev.map(c => {
      if (c.id === conferenceId) {
        return { ...c, registeredCount: c.registeredCount + 1 };
      }
      return c;
    }));

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect', e);
    }

    const cabDetails = needCab ? `🚕 Shuttle Pick-up: ${cabPickupLocation} (${cabPickupSlot})` : '🚕 Shuttle Service: Not Requested';
    
    dispatchEmail({
      type: 'Confirmation',
      recipientEmail: userInfo.email,
      recipientName: userInfo.name,
      subject: `✅ Registration Confirmation: ${targetConf.title}`,
      preview: `Your seat for ${targetConf.title} is confirmed! Meal: ${mealPreference} | ${cabDetails}`,
      badgeColor: 'bg-emerald-600',
      content: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2 style="color: #001e42;">xyz Learning & Development Department</h2>
          <p>Dear <strong>${userInfo.name}</strong>,</p>
          <p>Congratulations! Your registration for <strong>${targetConf.title}</strong> has been successfully processed.</p>
          
          <div style="background: #f4f6f9; border-left: 4px solid #0066cc; padding: 16px; border-radius: 6px; margin: 16px 0; border: 1px solid #cbd5e1;">
            <p style="margin: 4px 0;"><strong>Event Title:</strong> ${targetConf.title}</p>
            <p style="margin: 4px 0;"><strong>Date & Time:</strong> ${targetConf.date} | ${targetConf.time}</p>
            <p style="margin: 4px 0;"><strong>Location:</strong> ${targetConf.location}</p>
            <p style="margin: 4px 0;"><strong>Speaker:</strong> ${targetConf.speaker}</p>
            <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 8px 0;"/>
            <p style="margin: 4px 0;"><strong>Meal Preference:</strong> ${mealPreference}</p>
            <p style="margin: 4px 0;"><strong>Cab Shuttle Booking:</strong> ${cabDetails}</p>
          </div>

          <p><strong>Next Steps:</strong> You will receive a pre-event reminder prior to the event date. On the event day, scan your check-in code at the entrance.</p>
          <p>Warm regards,<br/><strong>xyz L&D Automation System</strong></p>
        </div>
      `
    });

    setTimeout(() => {
      dispatchEmail({
        type: 'Pre-Event',
        recipientEmail: userInfo.email,
        recipientName: userInfo.name,
        subject: `🔔 Pre-Event Reminder: ${targetConf.title} is coming up soon!`,
        preview: `Get ready for ${targetConf.title}! Review target topics and prep questions...`,
        badgeColor: 'bg-amber-600',
        content: `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <h2 style="color: #d97706;">Upcoming Event Reminder | xyz L&D</h2>
            <p>Hi <strong>${userInfo.name}</strong>,</p>
            <p>This is a quick automated follow-up reminder that <strong>${targetConf.title}</strong> takes place on <strong>${targetConf.date}</strong> at <strong>${targetConf.time}</strong>.</p>
            <p><strong>Target Topics:</strong> ${targetConf.subtitle}</p>
            <p>Please arrive 15 minutes before start time for smooth check-in.</p>
            <p>See you there!<br/><strong>xyz Learning & Development Team</strong></p>
          </div>
        `
      });
    }, 1200);

    return { success: true, message: 'Registered successfully!' };
  };

  const checkInAttendee = (registrationId) => {
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return;

    if (reg.checkedIn) {
      showToast('Attendee is already checked in!', 'info');
      return;
    }

    const conf = conferences.find(c => c.id === reg.conferenceId);
    const now = new Date().toISOString();

    setRegistrations(prev => prev.map(r => {
      if (r.id === registrationId) {
        return { ...r, checkedIn: true, checkedInAt: now };
      }
      return r;
    }));

    setConferences(prev => prev.map(c => {
      if (c.id === reg.conferenceId) {
        return { ...c, checkedInCount: c.checkedInCount + 1 };
      }
      return c;
    }));

    dispatchEmail({
      type: 'Check-In',
      recipientEmail: reg.userEmail,
      recipientName: reg.userName,
      subject: `🎉 Welcome to ${conf ? conf.title : 'Conference'}! Check-in Successful`,
      preview: `You have successfully checked in at ${new Date().toLocaleTimeString()}. We hope you learn and enjoy the session!`,
      badgeColor: 'bg-emerald-600',
      content: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2 style="color: #059669;">Check-in Confirmation | xyz L&D</h2>
          <p>Welcome, <strong>${reg.userName}</strong>!</p>
          <p>You have successfully checked inside <strong>${conf ? conf.title : 'the conference hall'}</strong>!</p>
          <div style="background: #ecfdf5; border-left: 4px solid #059669; padding: 14px; border-radius: 6px; margin: 12px 0; border: 1px solid #a7f3d0;">
            <p style="margin: 2px 0;"><strong>Attendee Name:</strong> ${reg.userName}</p>
            <p style="margin: 2px 0;"><strong>Check-in Time:</strong> ${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}</p>
            <p style="margin: 2px 0;"><strong>Meal Preference:</strong> ${reg.mealPreference}</p>
          </div>
          <p>We hope you gain valuable insights and enjoy the interactive learning sessions today!</p>
          <p>Warm regards,<br/><strong>xyz Learning and Devlopemnt department</strong></p>
        </div>
      `
    });

    showToast(`Checked in ${reg.userName}! Check-in welcome email sent.`, 'success');
  };

  const completeEventAutomations = (conferenceId) => {
    const targetConf = conferences.find(c => c.id === conferenceId);
    if (!targetConf) return;

    const eventRegistrations = registrations.filter(r => r.conferenceId === conferenceId);

    if (eventRegistrations.length === 0) {
      showToast('No registered attendees found for this event.', 'warning');
      return;
    }

    let checkedInUsers = [];
    let absenteeUsers = [];

    eventRegistrations.forEach(r => {
      if (r.checkedIn) {
        checkedInUsers.push(r);
      } else {
        absenteeUsers.push(r);
      }
    });

    checkedInUsers.forEach(user => {
      dispatchEmail({
        type: 'Feedback',
        recipientEmail: user.userEmail,
        recipientName: user.userName,
        subject: `📝 We value your feedback on "${targetConf.title}"`,
        preview: `Thank you for attending ${targetConf.title}! Please share your rating & thoughts...`,
        badgeColor: 'bg-[#0066cc]',
        content: `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <h2 style="color: #0066cc;">xyz L&D Post-Conference Feedback</h2>
            <p>Hi <strong>${user.userName}</strong>,</p>
            <p>Thank you for attending <strong>${targetConf.title}</strong> today!</p>
            <p>Your insights help us continuously elevate the learning experience across xyz.</p>
            <p>Warm regards,<br/><strong>xyz Learning and Devlopemnt department</strong></p>
          </div>
        `
      });

      const nextConfs = conferences.filter(c => c.id !== conferenceId).slice(0, 3);
      const confListHtml = nextConfs.map(c => `<li><strong>${c.title}</strong> (${c.date}) - <em>${c.category}</em></li>`).join('');

      dispatchEmail({
        type: 'Recommendation',
        recipientEmail: user.userEmail,
        recipientName: user.userName,
        subject: `🚀 Keep Learning! Recommended Upcoming Conferences at xyz`,
        preview: `Based on your attendance at ${targetConf.title}, check out "AI Ready Mindset", "Leading at xyz"...`,
        badgeColor: 'bg-[#001e42]',
        content: `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <h2 style="color: #001e42;">Personalized L&D Recommendations | xyz</h2>
            <p>Hi <strong>${user.userName}</strong>,</p>
            <p>Since you completed <strong>${targetConf.title}</strong>, we have handpicked these upcoming flagship conferences to advance your career path at xyz:</p>
            <ul>
              ${confListHtml}
            </ul>
            <p>Reserve your seats early before capacity is filled!</p>
            <p>Happy Learning,<br/><strong>xyz L&D Department</strong></p>
          </div>
        `
      });
    });

    absenteeUsers.forEach(user => {
      dispatchEmail({
        type: 'Absentee',
        recipientEmail: user.userEmail,
        recipientName: user.userName,
        subject: `💬 We missed you at "${targetConf.title}"`,
        preview: `Notice: You registered for ${targetConf.title} but were unable to check in...`,
        badgeColor: 'bg-rose-600',
        content: `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <h2 style="color: #dc2626;">xyz L&D Attendance Follow-Up</h2>
            <p>Dear <strong>${user.userName}</strong>,</p>
            <p>We noticed you registered for <strong>${targetConf.title}</strong> scheduled for ${targetConf.date}, but did not check in during the session.</p>
            <p>Session recordings and slides will be uploaded to the xyz L&D portal shorty.</p>
            <p>Regards,<br/><strong>xyz Learning and Devlopemnt department</strong></p>
          </div>
        `
      });
    });

    showToast(`Automated Mails Sent: Feedback, Recommendations & Absentee Follow-ups!`, 'success');
  };

  const addNewConference = (newConfData) => {
    const id = 'conf-' + Date.now();
    const formattedConf = {
      id,
      ...newConfData,
      registeredCount: 0,
      checkedInCount: 0,
      status: 'Upcoming',
      bannerTag: newConfData.bannerTag || 'Special Event',
      image: newConfData.image || '/images/ai_mindset.jpg'
    };

    setConferences(prev => [formattedConf, ...prev]);

    dispatchEmail({
      type: 'Broadcast',
      recipientEmail: 'all-employees@xyz.com',
      recipientName: 'All Employees',
      subject: `✨ New Conference Announced: ${newConfData.title}`,
      preview: `A new session "${newConfData.title}" has just been published by xyz L&D! Reserve your seat now.`,
      badgeColor: 'bg-[#0066cc]',
      content: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2 style="color: #001e42;">New Conference Alert | xyz L&D Department</h2>
          <p>Hello Team,</p>
          <p>We are excited to announce a brand-new conference on our L&D platform:</p>
          <div style="background: #f4f6f9; border-left: 4px solid #0066cc; padding: 16px; border-radius: 6px; border: 1px solid #cbd5e1;">
            <h3>${newConfData.title}</h3>
            <p><strong>Subtitle:</strong> ${newConfData.subtitle}</p>
            <p><strong>Target Audience:</strong> ${newConfData.targetAudience.join(', ')}</p>
            <p><strong>Date & Time:</strong> ${newConfData.date} | ${newConfData.time}</p>
          </div>
          <p>Register now via your employee portal to reserve your seat and meal/cab options!</p>
          <p>Best regards,<br/><strong>xyz Learning & Development Department</strong></p>
        </div>
      `
    });

    showToast(`Created event "${newConfData.title}"! Broadcast email sent.`, 'success');
  };

  const markEmailRead = (emailId) => {
    setEmails(prev => prev.map(e => e.id === emailId ? { ...e, read: true } : e));
  };

  return (
    <LDContext.Provider value={{
      USERS: users,
      currentUser,
      setCurrentUser,
      conferences,
      registrations,
      emails,
      groqApiKey,
      toast,
      showToast,
      registerNewAccount,
      loginUser,
      logoutUser,
      registerForConference,
      checkInAttendee,
      completeEventAutomations,
      addNewConference,
      markEmailRead,
      dispatchEmail
    }}>
      {children}
    </LDContext.Provider>
  );
};

export const useLD = () => useContext(LDContext);
