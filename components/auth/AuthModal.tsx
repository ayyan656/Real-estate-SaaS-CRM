import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, googleLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(loginEmail, loginPassword);
      onClose();
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(signupName, signupEmail, signupPassword);
      onClose();
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setIsLoading(true);
    try {
      // In a real app, this would redirect to your Passport.js backend route
      // e.g., window.location.href = '/auth/google';
      await googleLogin();
      onClose();
    } catch (err) {
      setError('Google authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-surface dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Tabs */}
        <div className="bg-primary dark:bg-slate-950 p-0 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
          >
            <X size={20} />
          </button>
          
          <div className="flex">
            <button
              onClick={() => { setActiveTab('login'); setError(''); }}
              className={`flex-1 py-6 text-center font-semibold text-sm transition-colors relative ${
                activeTab === 'login' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
              {activeTab === 'login' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />}
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setError(''); }}
              className={`flex-1 py-6 text-center font-semibold text-sm transition-colors relative ${
                activeTab === 'signup' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
              {activeTab === 'signup' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />}
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Google Login (Common for both) */}
          <button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-white border border-gray-300 text-slate-700 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 mb-6"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5 text-slate-400" /> : <GoogleIcon />}
            <span>Continue with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface dark:bg-slate-900 text-slate-500">Or continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in slide-in-from-right-4 duration-200">
              <div className="relative">
                <Mail className="absolute top-3 left-3 text-slate-400 w-5 h-5" />
                <Input 
                  type="email" 
                  placeholder="Email Address" 
                  value={loginEmail} 
                  onChange={e => setLoginEmail(e.target.value)} 
                  className="pl-10"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute top-3 left-3 text-slate-400 w-5 h-5" />
                <Input 
                  type="password" 
                  placeholder="Password" 
                  value={loginPassword} 
                  onChange={e => setLoginPassword(e.target.value)} 
                  className="pl-10"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button type="button" className="text-xs text-slate-500 hover:text-accent">Forgot password?</button>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded text-center">{error}</p>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4 animate-in slide-in-from-left-4 duration-200">
              <div className="relative">
                <User className="absolute top-3 left-3 text-slate-400 w-5 h-5" />
                <Input 
                  placeholder="Full Name" 
                  value={signupName} 
                  onChange={e => setSignupName(e.target.value)} 
                  className="pl-10"
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute top-3 left-3 text-slate-400 w-5 h-5" />
                <Input 
                  type="email" 
                  placeholder="Email Address" 
                  value={signupEmail} 
                  onChange={e => setSignupEmail(e.target.value)} 
                  className="pl-10"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute top-3 left-3 text-slate-400 w-5 h-5" />
                <Input 
                  type="password" 
                  placeholder="Create Password" 
                  value={signupPassword} 
                  onChange={e => setSignupPassword(e.target.value)} 
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded text-center">{error}</p>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                isLoading={isLoading}
              >
                Create Account
              </Button>
              
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          )}

          {/* Footer toggle */}
          <div className="mt-6 text-center text-sm pt-4 border-t border-gray-100 dark:border-slate-800">
             {activeTab === 'login' ? (
                <>
                  <span className="text-slate-500 dark:text-slate-400">Don't have an account? </span>
                  <button onClick={() => { setActiveTab('signup'); setError(''); }} className="font-medium text-accent hover:underline">
                    Sign up
                  </button>
                </>
             ) : (
                <>
                  <span className="text-slate-500 dark:text-slate-400">Already have an account? </span>
                  <button onClick={() => { setActiveTab('login'); setError(''); }} className="font-medium text-accent hover:underline">
                    Sign in
                  </button>
                </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};