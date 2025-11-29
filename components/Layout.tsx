
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, Settings, LogOut, Menu, X, User as UserIcon, ChevronDown } from 'lucide-react';
import { NavItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { ThemeToggle } from './ui/ThemeToggle';

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Properties', path: '/properties', icon: <Building2 size={20} /> },
  { label: 'Leads', path: '/leads', icon: <Users size={20} /> },
  { label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
];

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    if (location.pathname === '/profile') return 'My Profile';
    const item = NAV_ITEMS.find(i => i.path === location.pathname);
    return item ? item.label : 'Dashboard';
  };

  // If used inside ProtectedRoute, user should be present, but we guard just in case or for TS
  if (!user) return null;

  return (
    <div className="flex h-screen bg-background dark:bg-slate-950 overflow-hidden transition-colors duration-200">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-primary text-slate-300 h-full border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <Building2 className="text-accent" />
            <span>EstateFlow</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-accent text-white font-medium' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-surface dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 z-10 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-slate-600 dark:text-slate-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{getPageTitle()}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-4" ref={dropdownRef}>
              <div className="relative">
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full py-1 pr-3 pl-1 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-slate-700"
                >
                  {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-slate-700" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200">{user.name}</span>
                    <ChevronDown size={14} className="text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-100 dark:border-slate-800 py-2 animate-in fade-in zoom-in-95 duration-150 origin-top-right z-50">
                    <div className="px-4 py-2 border-b border-gray-50 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <button 
                        onClick={() => { navigate('/profile'); setIsProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <UserIcon size={16} /> Profile
                      </button>
                      <button 
                        onClick={() => { navigate('/settings'); setIsProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Settings size={16} /> Settings
                      </button>
                    </div>
                    <div className="border-t border-gray-50 dark:border-slate-800 pt-1">
                      <button 
                        onClick={() => {
                          logout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="relative flex-1 bg-primary w-64 max-w-xs h-full p-4 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <span className="text-white font-bold text-xl flex items-center gap-2">
                   <Building2 className="text-accent" /> EstateFlow
                 </span>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400">
                   <X />
                 </button>
              </div>
              <nav className="space-y-2 flex-1">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-slate-300 ${
                        isActive 
                          ? 'bg-accent text-white font-medium' 
                          : 'hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="border-t border-slate-700 pt-4">
                <div 
                   className="flex items-center gap-3 mb-4 px-2 cursor-pointer hover:bg-slate-800 p-2 rounded-lg transition-colors"
                   onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}
                >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-white text-sm font-medium">{user.name}</p>
                      <p className="text-slate-400 text-xs truncate w-32">{user.email}</p>
                    </div>
                </div>
                <button 
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
            <div className="flex-1 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* Page Content Scrollable Area */}
        <main className="flex-1 overflow-auto p-6 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
