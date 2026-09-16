import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  FileBarChart,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Sun,
  Moon,
  Film,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useIntro } from '../../hooks/useIntro';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/reports', icon: FileBarChart, label: 'Reports' },
];

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function Sidebar({ mobileOpen: externalMobileOpen, setMobileOpen: externalSetMobileOpen }: SidebarProps = {}) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { playIntro } = useIntro();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);

  const mobileOpen = externalMobileOpen !== undefined ? externalMobileOpen : internalMobileOpen;
  const setMobileOpen = externalSetMobileOpen || setInternalMobileOpen;

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-3">
        <div className="relative group">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-neon-cyan rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-glow transition-shadow duration-300">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 8h16M4 13h10M4 18h14" />
              <circle cx="19" cy="6" r="2.5" fill="currentColor" stroke="none" opacity="0.6" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-brand-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold text-surface-900 dark:text-white leading-none">FinSight</h1>
            <p className="text-[10px] text-surface-400 dark:text-surface-500 mt-0.5 truncate">Financial Intelligence</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-brand-500/10 dark:bg-brand-500/15 text-brand-700 dark:text-neon-violet'
                      : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-dark-50/30 hover:text-surface-900 dark:hover:text-surface-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-brand-500 to-neon-cyan rounded-full shadow-glow-sm" />
                    )}
                    <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-brand-600 dark:text-neon-violet' : ''}`} />
                    {(!collapsed || mobileOpen) && <span>{item.label}</span>}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Intro Clip Replay Button */}
      <div className="px-3 mb-1.5">
        <button
          onClick={() => {
            playIntro();
            setMobileOpen(false);
          }}
          className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium transition-all duration-200 group
            bg-gradient-to-r from-brand-500/10 via-neon-cyan/10 to-neon-violet/10 hover:from-brand-500/20 hover:via-neon-cyan/20 hover:to-neon-violet/20
            border border-brand-500/20 hover:border-brand-500/40 text-brand-600 dark:text-neon-cyan
            shadow-sm hover:shadow-glow-sm active:scale-98
            ${collapsed && !mobileOpen ? 'justify-center' : ''}`}
          aria-label="Watch Intro Video Clip"
          title="Watch Cinematic Intro"
        >
          <Film className="w-5 h-5 flex-shrink-0 text-brand-500 dark:text-neon-cyan group-hover:scale-110 transition-transform" />
          {(!collapsed || mobileOpen) && (
            <div className="flex items-center justify-between flex-1 min-w-0">
              <span className="font-semibold text-xs truncate">Watch Intro</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-700 dark:text-neon-cyan border border-brand-500/30">
                Clip
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Theme Toggle */}
      <div className="px-3 mb-2">
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium transition-all duration-300 group
            text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-dark-50/30
            ${collapsed && !mobileOpen ? 'justify-center' : ''}`}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <div className="relative w-5 h-5 flex-shrink-0">
            <Sun className={`w-5 h-5 absolute inset-0 transition-all duration-300 text-amber-500 ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
            <Moon className={`w-5 h-5 absolute inset-0 transition-all duration-300 text-neon-violet ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
          </div>
          {(!collapsed || mobileOpen) && (
            <span className="transition-colors">{isDark ? 'Dark mode' : 'Light mode'}</span>
          )}
        </button>
      </div>

      {/* User / Logout */}
      <div className="px-3 pb-4 mt-auto border-t border-surface-200/80 dark:border-white/[0.06] pt-4">
        <div className={`flex items-center gap-3 px-3 py-2 ${collapsed && !mobileOpen ? 'justify-center' : ''}`}>
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 shadow-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-neon-emerald rounded-full border-2 border-white dark:border-dark-200" />
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{user?.name}</p>
              <p className="text-xs text-surface-400 dark:text-surface-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2 w-full rounded-xl text-sm font-medium
            text-surface-600 dark:text-surface-400
            hover:bg-red-50 hover:text-red-600
            dark:hover:bg-red-500/10 dark:hover:text-neon-rose
            transition-all duration-200 mt-1 ${collapsed && !mobileOpen ? 'justify-center' : ''}`}
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(!collapsed || mobileOpen) && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle (desktop only) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-16 w-6 h-6 bg-white dark:bg-dark-200 border border-surface-200 dark:border-dark-50/40 rounded-full items-center justify-center text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 shadow-sm hover:shadow-md transition-all duration-200"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 dark:bg-black/70 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white/95 dark:bg-dark-300/98 backdrop-blur-2xl border-r border-surface-200/80 dark:border-white/[0.08] shadow-2xl transform transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile Navigation"
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-dark-50/30 transition-colors"
          aria-label="Close navigation menu"
        >
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:block fixed inset-y-0 left-0 z-30 bg-white/70 dark:bg-dark-300/60 backdrop-blur-2xl border-r border-surface-200/80 dark:border-white/[0.06] transition-all duration-300 ${
          collapsed ? 'w-[72px]' : 'w-60'
        }`}
      >
        <div className="relative h-full">{sidebarContent}</div>
      </aside>

      {/* Spacer */}
      <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-60'}`} />
    </>
  );
}
