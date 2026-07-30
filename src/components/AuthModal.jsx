import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { X, UserPlus, LogIn, Mail, Lock, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--n-navy-dark)' }}>{label}</label>
    {children}
  </div>
);

const StyledInput = ({ type = 'text', placeholder, value, onChange, required = true, suffix, icon: Icon }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {Icon && <Icon size={14} color="var(--n-gray-mid)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', 
          padding: Icon ? '10px 36px 10px 34px' : '10px 12px',
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
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
          {suffix}
        </div>
      )}
    </div>
  );
};

export const AuthModal = ({ isOpen, onClose }) => {
  const { registerNewAccount, loginUser } = useLD();

  const [mode, setMode] = useState('signup'); // 'signup' | 'signin'

  // Sign up state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [department, setDepartment] = useState('Engineering');
  const [role, setRole] = useState('Employee');

  // Sign in state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  if (!isOpen) return null;

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    const res = registerNewAccount({
      name,
      email,
      password,
      department,
      role
    });

    if (res.success) {
      onClose();
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!loginEmail) return;

    const res = loginUser(loginEmail, loginPassword);
    if (res.success) {
      onClose();
    }
  };

  const eyeBtn = (show, toggle) => (
    <button type="button" onClick={toggle} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', padding: 2 }}>
      {show ? <EyeOff size={14} color="var(--n-navy)" /> : <Eye size={14} color="var(--n-gray-mid)" />}
    </button>
  );

  const selectStyle = {
    width: '100%', 
    padding: '10px 12px', 
    borderRadius: 8, 
    border: '1px solid #D1D5DB',
    fontSize: 13, 
    fontFamily: 'var(--font-sans)', 
    color: '#333333', 
    background: '#ffffff',
    outline: 'none', 
    boxSizing: 'border-box', 
    cursor: 'pointer'
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9100,
      background: 'rgba(0, 20, 60, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: 480,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #E2E8F0',
          background: 'linear-gradient(135deg, #003087 0%, #00205B 100%)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
              {mode === 'signup' ? <UserPlus size={18} color="#009CDE" /> : <LogIn size={18} color="#009CDE" />}
              {mode === 'signup' ? 'Create Account' : 'Sign In to Portal'}
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
              xyz Learning and Development Department
            </p>
          </div>
          <button 
            onClick={onClose} 
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: 8,
              padding: 6,
              cursor: 'pointer',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          background: '#F8FAFC',
          padding: '4px',
          margin: '16px 16px 0',
          borderRadius: 8,
          border: '1px solid #E2E8F0'
        }}>
          <button
            onClick={() => setMode('signup')}
            style={{
              flex: 1, padding: '8px 12px', border: 'none', cursor: 'pointer',
              borderRadius: 6, fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-sans)',
              background: mode === 'signup' ? '#ffffff' : 'transparent',
              color: mode === 'signup' ? '#003087' : '#767676',
              boxShadow: mode === 'signup' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Create New Account
          </button>
          <button
            onClick={() => setMode('signin')}
            style={{
              flex: 1, padding: '8px 12px', border: 'none', cursor: 'pointer',
              borderRadius: 6, fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-sans)',
              background: mode === 'signin' ? '#ffffff' : 'transparent',
              color: mode === 'signin' ? '#003087' : '#767676',
              boxShadow: mode === 'signin' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Sign In Existing
          </button>
        </div>

        <div style={{ padding: '20px 24px 24px' }}>
          {mode === 'signup' ? (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Full Name">
                <StyledInput icon={User} placeholder="e.g. Rahul Sharma" value={name} onChange={e => setName(e.target.value)} />
              </Field>

              <Field label="Email Address">
                <StyledInput icon={Mail} type="email" placeholder="name@xyz.com" value={email} onChange={e => setEmail(e.target.value)} />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Department">
                  <select value={department} onChange={e => setDepartment(e.target.value)} style={selectStyle}>
                    {['Engineering', 'Leadership', 'Product', 'HR', 'Design', 'Finance', 'Operations', 'Sales'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Account Role">
                  <select value={role} onChange={e => setRole(e.target.value)} style={selectStyle}>
                    <option value="Employee">Employee</option>
                    <option value="Admin">L&amp;D Admin</option>
                  </select>
                </Field>
              </div>

              <Field label="Password">
                <StyledInput
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  suffix={eyeBtn(showPassword, () => setShowPassword(!showPassword))}
                />
              </Field>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 12,
                marginTop: 6,
                paddingTop: 16,
                borderTop: '1px solid #E2E8F0'
              }}>
                <button type="button" onClick={onClose} style={{
                  padding: '8px 16px', borderRadius: 6, border: '1px solid #D1D5DB',
                  background: '#ffffff', color: '#333333', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)'
                }}>Cancel</button>
                <button type="submit" style={{
                  padding: '8px 16px', borderRadius: 6, border: 'none',
                  background: '#003087', color: '#ffffff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)'
                }}>
                  <ShieldCheck size={14} /> Create Account
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Email Address">
                <StyledInput icon={Mail} type="email" placeholder="name@xyz.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
              </Field>

              <Field label="Password">
                <StyledInput
                  icon={Lock}
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  suffix={eyeBtn(showLoginPassword, () => setShowLoginPassword(!showLoginPassword))}
                />
              </Field>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 12,
                marginTop: 6,
                paddingTop: 16,
                borderTop: '1px solid #E2E8F0'
              }}>
                <button type="button" onClick={onClose} style={{
                  padding: '8px 16px', borderRadius: 6, border: '1px solid #D1D5DB',
                  background: '#ffffff', color: '#333333', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)'
                }}>Cancel</button>
                <button type="submit" style={{
                  padding: '8px 16px', borderRadius: 6, border: 'none',
                  background: '#003087', color: '#ffffff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)'
                }}>Sign In</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
