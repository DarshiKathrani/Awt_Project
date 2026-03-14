'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');

  try {
    const res = await fetch('https://awt-project-glqp.onrender.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Keep this to allow the backend to try setting the cookie too
      credentials: 'include', 
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || 'Invalid credentials');
      return;
    }

    if (!data.token) {
      setMessage('Login failed. Token not received.');
      return;
    }

    // --- STEP 1: MANUALLY SET THE COOKIE FOR VERCEL DOMAIN ---
    // This is the "Magic Fix" for cross-domain redirection loops.
    // It saves the token to the current domain (Vercel) so your Layouts can see it.
    document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax; Secure`;

    // --- STEP 2: SAFE JWT DECODE ---
    // Standard atob can fail on some JWTs. This replaces URL-safe characters first.
    const base64Url = data.token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    const role = payload.role;

    console.log("Authenticated Role:", role);
    setMessage('Login successful! Redirecting...');

    // --- STEP 3: REDIRECT WITH SMALL DELAY ---
    // We use a 100ms delay to ensure the browser has finished writing 
    // the cookie to disk before the next page's Layout tries to read it.
    setTimeout(() => {
      if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'staff') {
        router.push('/dashboard');
      } else if (role === 'meeting_convener') {
        router.push('/convener-dashboard');
      } else {
        router.push('/not-authorized');
      }
    }, 100);

  } catch (error) {
    console.error('Login error:', error);
    setMessage('Server error. Please try again later.');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center px-4 relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>

      <div className="w-full max-w-md relative">
        {/* Logo Area */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-[2rem] shadow-xl shadow-indigo-100/50 mb-4 border border-white">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
            Staff<span className="text-indigo-600">Pulse</span>
          </h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
            MinutesHQ Security Gateway
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-white/50 relative">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Corporate Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-sm font-medium shadow-sm"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end ml-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Secret Key
                  </label>
                  <a href="#" className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter hover:underline">Forgot?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-sm font-medium shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Status Message */}
            {message && (
              <div className={`p-4 rounded-2xl text-[11px] font-black uppercase tracking-wider animate-in fade-in slide-in-from-top-2 duration-300 ${
                message.includes('successful')
                  ? 'bg-green-50 text-green-600 border border-green-100'
                  : 'bg-red-50 text-red-600 border border-red-100'
              }`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black uppercase text-[11px] tracking-[0.2em] hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Secure Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          &copy; 2026 MinutesHQ <span className="mx-2 text-gray-200">|</span> Encrypted Connection
        </p>
      </div>
    </div>
  );
}