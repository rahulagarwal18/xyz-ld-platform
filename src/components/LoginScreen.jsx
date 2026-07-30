import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { Mail, Lock, User, UserPlus, LogIn, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const LoginScreen = () => {
  const { loginUser, registerNewAccount, USERS } = useLD();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'

  // Sign In inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up inputs
  const [name, setName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [department, setDepartment] = useState('Engineering');
  const [role, setRole] = useState('Employee');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    loginUser(email, password);
  };

  const handleQuickDemoLogin = (userEmail) => {
    loginUser(userEmail, '123456');
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!name || !signUpEmail) return;
    registerNewAccount({
      name,
      email: signUpEmail,
      password: signUpPassword,
      department,
      role
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col items-center justify-center p-4">
      
      {/* Brand Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0066cc] text-white font-extrabold text-2xl shadow-lg border border-white/20 mb-2">
          xyz
        </div>
        <h1 className="text-3xl font-extrabold text-[#001e42] tracking-tight">
          xyz Global L&D Platform
        </h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Learning and Devlopemnt department
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden border-t-4 border-t-[#0066cc]">
        
        {/* Toggle Mode */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-3.5 flex items-center justify-center gap-2 transition-all ${
              mode === 'signin'
                ? 'bg-white text-[#0066cc] border-b-2 border-[#0066cc] font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-3.5 flex items-center justify-center gap-2 transition-all ${
              mode === 'signup'
                ? 'bg-white text-[#0066cc] border-b-2 border-[#0066cc] font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Create New Account
          </button>
        </div>

        <div className="p-6">
          {mode === 'signin' ? (
            /* SIGN IN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="form-label-nielsen">Email Address (Gmail, Outlook, Work)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@gmail.com or @outlook.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-nielsen !pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="form-label-nielsen">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-nielsen !pl-9 !pr-10 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-[#0066cc]" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full btn-nielsen-primary justify-center text-xs py-3 shadow-md">
                <span>Sign In to Employee Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Demo Login Preset Buttons */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider text-center">
                  Or One-Click Sign In As Test Users:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {USERS.map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickDemoLogin(u.email)}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-[#0066cc] text-left transition-all hover:bg-blue-50/50"
                    >
                      <div className="text-xs font-extrabold text-[#001e42] flex items-center gap-1">
                        <span>{u.avatar}</span> <span className="truncate">{u.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{u.role}</div>
                    </button>
                  ))}
                </div>
              </div>

            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div>
                <label className="form-label-nielsen">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input-nielsen !pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="form-label-nielsen">Work or Personal Email (Gmail / Outlook)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="your.name@gmail.com or @outlook.com"
                    value={signUpEmail}
                    onChange={e => setSignUpEmail(e.target.value)}
                    className="input-nielsen !pl-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label-nielsen">Department</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="input-nielsen text-xs"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Product">Product</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
                <div>
                  <label className="form-label-nielsen">Role Type</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="input-nielsen text-xs font-bold"
                  >
                    <option value="Employee">Normal Employee</option>
                    <option value="Admin">L&D Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label-nielsen">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={signUpPassword}
                    onChange={e => setSignUpPassword(e.target.value)}
                    className="input-nielsen !pl-9 !pr-10 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                    title={showSignUpPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showSignUpPassword ? <EyeOff className="w-4 h-4 text-[#0066cc]" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full btn-nielsen-primary justify-center text-xs py-3 shadow-md">
                <ShieldCheck className="w-4 h-4" />
                <span>Create Account & Send Welcome Mail</span>
              </button>
            </form>
          )}
        </div>

      </div>

      <div className="mt-8 text-xs font-semibold text-slate-500">
        xyz Learning and Devlopemnt department • Real Gmail & Outlook Email Platform
      </div>

    </div>
  );
};
