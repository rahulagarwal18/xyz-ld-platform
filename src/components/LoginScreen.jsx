import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { Mail, Lock, User, UserPlus, LogIn, ArrowRight, ShieldCheck, Eye, EyeOff, UserCheck } from 'lucide-react';

const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
    <label style={{ 
      fontSize: 11, 
      fontWeight: 700, 
      color: '#00205B', 
      textTransform: 'uppercase', 
      letterSpacing: '0.5px' 
    }}>
      {label}
    </label>
    {children}
  </div>
);

const IconInput = ({ icon: Icon, type = 'text', placeholder, value, onChange, suffix }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ 
      position: 'relative', 
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{
        position: 'absolute',
        left: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        <Icon size={16} color={focused ? '#009CDE' : '#94A3B8'} style={{ transition: 'color 0.15s ease' }} />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', 
          padding: '12px 40px 12px 38px',
          borderRadius: 8, 
          border: focused ? '2px solid #009CDE' : '1px solid #D1D5DB',
          fontSize: 13, 
          fontFamily: 'var(--font-sans)', 
          color: '#333333',
          background: '#ffffff', 
          outline: 'none', 
          boxSizing: 'border-box',
          transition: 'all 0.15s ease',
          boxShadow: focused ? '0 0 0 3px rgba(0, 156, 222, 0.15)' : 'none'
        }}
      />
      {suffix && (
        <div style={{ 
          position: 'absolute', 
          right: 12, 
          display: 'flex',
          alignItems: 'center' 
        }}>
          {suffix}
        </div>
      )}
    </div>
  );
};

export const LoginScreen = () => {
  const { loginUser, registerNewAccount, USERS } = useLD();

  const [mode, setMode]                         = useState('signin');
  const [email, setEmail]                       = useState('');
  const [password, setPassword]                 = useState('');
  const [showPw, setShowPw]                     = useState(false);
  const [name, setName]                         = useState('');
  const [signUpEmail, setSignUpEmail]           = useState('');
  const [signUpPassword, setSignUpPassword]     = useState('');
  const [showSignUpPw, setShowSignUpPw]         = useState(false);
  const [department, setDepartment]             = useState('Engineering');
  const [role, setRole]                         = useState('Employee');

  const handleSignIn  = (e) => { e.preventDefault(); loginUser(email, password); };
  const handleSignUp  = (e) => { e.preventDefault(); registerNewAccount({ name, email: signUpEmail, password: signUpPassword, department, role }); };
  const quickLogin    = (u)  => loginUser(u.email, '123456');

  const eyeBtn = (show, toggle) => (
    <button 
      type="button" 
      onClick={toggle} 
      style={{ 
        border: 'none', 
        background: 'none', 
        cursor: 'pointer', 
        display: 'flex', 
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {show ? <EyeOff size={16} color="#003087" /> : <Eye size={16} color="#94A3B8" />}
    </button>
  );

  const selectStyle = {
    width: '100%', 
    padding: '12px', 
    borderRadius: 8, 
    border: '1px solid #D1D5DB',
    fontSize: 13, 
    fontFamily: 'var(--font-sans)', 
    color: '#333333', 
    background: '#ffffff',
    outline: 'none', 
    boxSizing: 'border-box', 
    cursor: 'pointer',
    transition: 'border-color 0.15s ease'
  };

  return (
    <div style={{
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#ffffff', 
      padding: '40px 20px', 
      fontFamily: "var(--font-sans)",
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%', 
        maxWidth: 400,
        display: 'flex', 
        flexDirection: 'column', 
        gap: 28
      }}>

        {/* ── Corporate Header ── */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 52, 
            height: 52, 
            borderRadius: 12,
            background: 'linear-gradient(135deg, #003087 0%, #00205B 100%)', 
            color: '#ffffff',
            fontWeight: 800, 
            fontSize: 18, 
            marginBottom: 16,
            boxShadow: '0 4px 12px rgba(0,48,135,0.2)'
          }}>
            xyz
          </div>
          <h1 style={{ 
            color: '#00205B', 
            fontSize: 24, 
            fontWeight: 800, 
            margin: 0, 
            letterSpacing: '-0.5px' 
          }}>
            xyz TLCE LMS
          </h1>
          <p style={{ 
            color: '#767676', 
            fontSize: 12, 
            marginTop: 6, 
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Learning &amp; Development Portal
          </p>
        </div>

        {/* ── Main Form Container ── */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden'
        }}>

          {/* Clean Segmented Tab Control */}
          <div style={{ 
            display: 'flex', 
            background: '#F8FAFC',
            padding: '6px',
            margin: '12px 12px 0',
            borderRadius: 10,
            border: '1px solid #E2E8F0'
          }}>
            {[
              { key: 'signin', icon: LogIn, label: 'Sign In' },
              { key: 'signup', icon: UserPlus, label: 'Register' },
            ].map(({ key, icon: Icon, label }) => {
              const active = mode === key;
              return (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  style={{
                    flex: 1, 
                    padding: '8px 12px', 
                    border: 'none', 
                    cursor: 'pointer',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: 8,
                    fontSize: 12, 
                    fontWeight: 700, 
                    fontFamily: 'var(--font-sans)',
                    borderRadius: 8,
                    background: active ? '#ffffff' : 'transparent',
                    color: active ? '#003087' : '#767676',
                    boxShadow: active ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={14} /> {label}
                </button>
              );
            })}
          </div>

          {/* Form Area */}
          <div style={{ padding: '24px' }}>
            {mode === 'signin' ? (
              <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                <Field label="Work Email Address">
                  <IconInput
                    icon={Mail}
                    type="email"
                    placeholder="employee@xyz.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </Field>

                <Field label="Password">
                  <IconInput
                    icon={Lock}
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    suffix={eyeBtn(showPw, () => setShowPw(p => !p))}
                  />
                </Field>

                <button
                  type="submit"
                  style={{
                    width: '100%', 
                    padding: '13px', 
                    borderRadius: 8, 
                    border: 'none',
                    background: '#003087',
                    color: '#ffffff', 
                    fontWeight: 700, 
                    fontSize: 14, 
                    cursor: 'pointer',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: 8,
                    transition: 'background 0.2s ease', 
                    fontFamily: 'var(--font-sans)',
                    marginTop: 6
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#00205B'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#003087'; }}
                >
                  Continue <ArrowRight size={16} />
                </button>

                {/* Quick login demo preset section */}
                <div style={{ paddingTop: 20, borderTop: '1px solid #E2E8F0', marginTop: 8 }}>
                  <div style={{ 
                    fontSize: 10, 
                    fontWeight: 800, 
                    color: '#767676', 
                    textAlign: 'center', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px', 
                    marginBottom: 12 
                  }}>
                    Select Test Profile
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {USERS?.map(u => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => quickLogin(u)}
                        style={{
                          padding: '10px', 
                          borderRadius: 8, 
                          cursor: 'pointer', 
                          textAlign: 'left',
                          border: '1px solid #E2E8F0', 
                          background: '#ffffff',
                          transition: 'all 0.15s ease', 
                          fontFamily: 'var(--font-sans)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2
                        }}
                        onMouseEnter={e => { 
                          e.currentTarget.style.borderColor = '#009CDE'; 
                          e.currentTarget.style.background = '#E5F4FC'; 
                        }}
                        onMouseLeave={e => { 
                          e.currentTarget.style.borderColor = '#E2E8F0'; 
                          e.currentTarget.style.background = '#ffffff'; 
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <UserCheck size={14} color="#003087" />
                          <span style={{ 
                            fontSize: 11, 
                            fontWeight: 700, 
                            color: '#00205B', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap' 
                          }}>
                            {u.name.split(' ')[0]}
                          </span>
                        </div>
                        <div style={{ 
                          fontSize: 9, 
                          color: '#767676', 
                          fontWeight: 600, 
                          marginLeft: 20,
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}>
                          {u.role}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </form>
            ) : (
              <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                <Field label="Full Name">
                  <IconInput icon={User} placeholder="e.g. Vikram Patel" value={name} onChange={e => setName(e.target.value)} />
                </Field>

                <Field label="Work Email Address">
                  <IconInput icon={Mail} type="email" placeholder="name@xyz.com" value={signUpEmail} onChange={e => setSignUpEmail(e.target.value)} />
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <Field label="Department">
                    <select value={department} onChange={e => setDepartment(e.target.value)} style={selectStyle}>
                      {['Engineering','Leadership','Product','HR','Design','Finance','Operations','Sales'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Role">
                    <select value={role} onChange={e => setRole(e.target.value)} style={selectStyle}>
                      <option value="Employee">Employee</option>
                      <option value="Admin">L&amp;D Admin</option>
                    </select>
                  </Field>
                </div>

                <Field label="Password">
                  <IconInput
                    icon={Lock}
                    type={showSignUpPw ? 'text' : 'password'}
                    placeholder="Create security password"
                    value={signUpPassword}
                    onChange={e => setSignUpPassword(e.target.value)}
                    suffix={eyeBtn(showSignUpPw, () => setShowSignUpPw(p => !p))}
                  />
                </Field>

                <button
                  type="submit"
                  style={{
                    width: '100%', 
                    padding: '13px', 
                    borderRadius: 8, 
                    border: 'none',
                    background: '#003087',
                    color: '#ffffff', 
                    fontWeight: 700, 
                    fontSize: 14, 
                    cursor: 'pointer',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: 8,
                    transition: 'background 0.2s ease', 
                    fontFamily: 'var(--font-sans)',
                    marginTop: 6
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#00205B'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#003087'; }}
                >
                  <ShieldCheck size={16} /> Register Account
                </button>

              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <p style={{ color: '#767676', fontSize: 11, textAlign: 'center', margin: 0, fontWeight: 600 }}>
          &copy; 2026 xyz Consumer LLC. All rights reserved.
        </p>
      </div>
    </div>
  );
};
