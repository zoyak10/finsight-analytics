import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, Sun, Moon, Film } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useIntro } from '../../hooks/useIntro';

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { playIntro } = useIntro();

  return (
    <div className="flex min-h-screen bg-surface-50 dark:bg-dark-300 transition-colors duration-300">
      {/* Gradient mesh background */}
      <div className="gradient-mesh">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Mobile Top App Bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-30 h-16 bg-white/80 dark:bg-dark-300/80 backdrop-blur-xl border-b border-surface-200/80 dark:border-white/[0.06] px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-surface-100/80 dark:bg-dark-200/80 text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-dark-50/50 transition-colors active:scale-95"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-neon-cyan rounded-lg flex items-center justify-center shadow-glow-sm flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 8h16M4 13h10M4 18h14" />
                <circle cx="19" cy="6" r="2.5" fill="currentColor" stroke="none" opacity="0.6" />
              </svg>
            </div>
            <span className="font-bold text-base text-surface-900 dark:text-white">FinSight</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => playIntro()}
            className="p-2 rounded-xl text-brand-500 dark:text-neon-cyan hover:bg-surface-100 dark:hover:bg-dark-200/80 transition-colors"
            aria-label="Watch Intro Video Clip"
            title="Watch Intro"
          >
            <Film className="w-4 h-4" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-dark-200/80 transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neon-violet" />}
          </button>
          <div className="w-7 h-7 bg-gradient-to-br from-brand-400 to-brand-600 text-white rounded-full flex items-center justify-center text-xs font-semibold shadow-sm">
            {user?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </header>

      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="flex-1 min-w-0 relative z-10 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
