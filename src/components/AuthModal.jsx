import React, { useState } from 'react';
import { useLD } from '../context/LDContext';
import { X, UserPlus, LogIn, Mail, Lock, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';

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

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 border-t-4 border-t-[#0066cc]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-extrabold text-[#001e42] flex items-center gap-2">
              {mode === 'signup' ? <UserPlus className="w-5 h-5 text-[#0066cc]" /> : <LogIn className="w-5 h-5 text-[#0066cc]" />}
              {mode === 'signup' ? 'Create Employee Account' : 'Sign In to xyz L&D Portal'}
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              xyz Learning and Devlopemnt department
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded bg-slate-100 text-slate-500 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 my-4 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-md transition-all ${
              mode === 'signup'
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Create New Account
          </button>
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 rounded-md transition-all ${
              mode === 'signin'
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Sign In Existing User
          </button>
        </div>

        {mode === 'signup' ? (
          /* SIGN UP FORM */
          <form onSubmit={handleSignUp} className="space-y-4">
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
              <label className="form-label-nielsen">Gmail / Outlook / Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="your.email@gmail.com or @outlook.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-nielsen !pl-9 text-xs"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">
                Automated event notifications & confirmations will be dispatched to this inbox.
              </p>
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
                  <option value="Leadership">Leadership & Management</option>
                  <option value="Product">Product Management</option>
                  <option value="HR">HR & People Operations</option>
                  <option value="Marketing">Marketing & Growth</option>
                  <option value="Operations">Global Operations</option>
                </select>
              </div>

              <div>
                <label className="form-label-nielsen">Account Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="input-nielsen text-xs font-bold"
                >
                  <option value="Employee">Employee Attendee</option>
                  <option value="Manager">Manager / Team Lead</option>
                  <option value="Admin">L&D Administrator (Full Access)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label-nielsen">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
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

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
              <button type="button" onClick={onClose} className="btn-nielsen-secondary text-xs">
                Cancel
              </button>
              <button type="submit" className="btn-nielsen-primary text-xs">
                <ShieldCheck className="w-4 h-4" /> Create Account & Send Email
              </button>
            </div>
          </form>
        ) : (
          /* SIGN IN FORM */
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="form-label-nielsen">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="input-nielsen !pl-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="form-label-nielsen">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="input-nielsen !pl-9 !pr-10 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                  title={showLoginPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4 text-[#0066cc]" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
              <button type="button" onClick={onClose} className="btn-nielsen-secondary text-xs">
                Cancel
              </button>
              <button type="submit" className="btn-nielsen-primary text-xs">
                Sign In
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
