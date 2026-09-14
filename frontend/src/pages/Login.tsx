import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      addToast('success', 'Welcome to FinSight');
      navigate('/');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid email or password';
      setError(msg);
      addToast('error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex login-bg relative overflow-hidden">
      {/* Animated orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[55%] relative z-10 overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-brand-500 to-neon-cyan rounded-xl flex items-center justify-center shadow-glow">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 8h16M4 13h10M4 18h14" />
                <circle cx="19" cy="6" r="2.5" fill="currentColor" stroke="none" opacity="0.6" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">FinSight</span>
          </div>

          {/* Hero content */}
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-neon-cyan font-medium mb-6 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Financial Analytics Platform
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight">
              Financial intelligence,
              <br />
              <span className="bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-rose bg-clip-text text-transparent">
                without the chaos.
              </span>
            </h1>
            <p className="mt-6 text-surface-400 text-lg leading-relaxed">
              Track revenue, analyze expenses, and generate reports with clarity and precision.
            </p>

            {/* Stats decoration */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { label: 'Revenue Tracked', value: '₹3.4L+' },
                { label: 'Transactions', value: '300+' },
                { label: 'Reports Generated', value: 'Real-time' },
              ].map((stat) => (
                <div key={stat.label} className="border-l border-white/10 pl-4">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-surface-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-surface-600">
            © {new Date().getFullYear()} FinSight. Built for financial clarity.
          </p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-12 relative z-10">
        <div className="w-full max-w-sm">
          {/* Glass card */}
          <div className="bg-white/[0.07] backdrop-blur-2xl rounded-3xl border border-white/[0.1] shadow-2xl p-6 sm:p-8">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-neon-cyan rounded-xl flex items-center justify-center shadow-glow">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 8h16M4 13h10M4 18h14" />
                  <circle cx="19" cy="6" r="2.5" fill="currentColor" stroke="none" opacity="0.6" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">FinSight</span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Welcome back</h2>
              <p className="text-xs sm:text-sm text-surface-400 mt-1 sm:mt-1.5">
                Sign in to access your financial dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
              {error && (
                <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-neon-rose animate-fade-in" role="alert">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-surface-300 mb-1.5">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@finsight.com"
                  className="w-full px-4 py-3 text-base sm:text-sm bg-white/[0.06] border border-white/[0.1] rounded-xl placeholder:text-surface-500 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400/50 transition-all duration-200 backdrop-blur-sm"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-surface-300 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-10 text-base sm:text-sm bg-white/[0.06] border border-white/[0.1] rounded-xl placeholder:text-surface-500 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400/50 transition-all duration-200 backdrop-blur-sm"
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-surface-400 hover:text-surface-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-500 rounded-xl hover:from-brand-500 hover:to-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all duration-200 shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 px-4 py-3 bg-white/[0.04] rounded-xl border border-white/[0.06]">
              <p className="text-xs text-surface-500 font-medium mb-1">Demo credentials</p>
              <p className="text-xs text-surface-400 font-mono">admin@finsight.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
