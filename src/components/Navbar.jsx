import { useState } from 'react';
import { Search, Heart, Home, TrendingUp, Sliders, LogIn, LogOut, Ticket, Shield } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export default function Navbar({ activeTab, setActiveTab, searchTerm, setSearchTerm, onToggleSidebar, currentUser, onOpenAuth, onLogout }) {
  const { watchlist } = useWatchlist();
  const [isFocused, setIsFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Dynamic Navigation Links based on User Role
  const getNavLinks = () => {
    if (!currentUser) return []; // No navigation tabs for Guest
    
    const links = [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'trending', label: 'Trending', icon: TrendingUp },
      { id: 'genres', label: 'Genres', icon: Sliders },
    ];
    
    // Admin role gets direct Admin Dashboard link
    if (currentUser.role === 'admin') {
      links.push({ id: 'admin', label: 'Admin', icon: Shield });
    }
    
    return links;
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 bg-cinemaBlack/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => {
              if (currentUser) {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }} 
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="relative w-11 h-11 flex items-center justify-center">
              {/* Clapperboard background */}
              <svg 
                className="absolute w-10 h-10 text-goldAccent filter drop-shadow-[0_0_8px_rgba(251,191,36,0.3)] group-hover:rotate-[-6deg] transition-all duration-300"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M4 18h16" />
                <path d="M4 14h16" />
                <path d="M4 10h16" />
                <path d="m22 8-6-4" />
                <path d="m16 8-6-4" />
                <path d="m10 8-6-4" />
                <path d="M2 10v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V10" />
              </svg>
              
              {/* Tiny ticket overlay */}
              <div className="absolute bottom-[-2px] right-[-4px] bg-cinemaBlack border border-goldAccent/30 rounded px-1 py-0.5 shadow-md flex items-center justify-center transform rotate-12 group-hover:scale-110 transition-transform duration-300">
                <Ticket className="w-3.5 h-3.5 text-goldAccent fill-goldAccent" />
              </div>
            </div>
            
            <div className="flex flex-col items-start leading-none">
              <span className="font-display font-black text-xl tracking-wider text-white">
                CINE<span className="text-goldAccent">VERSE</span>
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[8px] font-bold text-goldAccent tracking-widest">★ RATING</span>
                <span className="text-[8px] text-textSub">·</span>
                <span className="text-[8px] font-bold text-textSub tracking-widest">TRAILER</span>
              </div>
            </div>
          </div>

          {/* Navigation links (Desktop only - Shown only to logged in users) */}
          {currentUser && (
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActiveTab(link.id);
                      if (link.id === 'genres') {
                        document.getElementById('genres-section')?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`text-sm font-semibold tracking-wide flex items-center gap-2 transition-colors duration-300 ${
                      isActive ? 'text-goldAccent' : 'text-textSub hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </button>
                );
              })}

              {/* Watchlist toggle */}
              <button
                onClick={onToggleSidebar}
                className="text-sm font-semibold tracking-wide flex items-center gap-2 text-textSub hover:text-white transition-colors duration-300 relative"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/10 hover:fill-rose-500 transition-all" />
                <span>Watchlist</span>
                {watchlist.length > 0 && (
                  <span className="absolute -top-2.5 -right-3.5 bg-goldAccent text-cinemaBlack font-bold text-[10px] px-1.5 py-0.5 rounded-full">
                    {watchlist.length}
                  </span>
                )}
              </button>
            </nav>
          )}

          {/* Search & User Area */}
          <div className="flex items-center gap-4">
            
            {/* Pill Search Bar (Shown only if logged in) */}
            {currentUser && (
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className={`w-4 h-4 transition-colors duration-300 ${isFocused ? 'text-goldAccent' : 'text-textSub'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Cari..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`bg-neutral-900/60 border rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-textSub focus:outline-none transition-all duration-300 w-28 sm:w-48 ${
                    isFocused 
                      ? 'border-goldAccent ring-1 ring-goldAccent/30 w-36 sm:w-56 bg-neutral-900' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                />
              </div>
            )}

            {/* User Dropdown / Login Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu((v) => !v)}
                  className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-goldAccent/40 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-goldAccent to-amber-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-cinemaBlack font-black text-sm">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-white hidden sm:inline max-w-[90px] truncate">
                    {currentUser.name}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-52 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1 z-50">
                    <div className="px-4 py-3 border-b border-white/5">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                        {currentUser.role === 'admin' && (
                          <span className="text-[8px] bg-goldAccent/20 text-goldAccent font-black px-1.5 py-0.5 rounded-full">ADMIN</span>
                        )}
                      </div>
                      <p className="text-[10px] text-textSub truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onToggleSidebar();
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs text-textSub hover:text-white hover:bg-white/5 flex items-center gap-2.5 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>Watchlist Saya ({watchlist.length})</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 flex items-center gap-2.5 transition-colors border-t border-white/5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-goldAccent text-cinemaBlack font-bold text-xs hover:bg-amber-400 transition-all duration-300 shadow-gold-glow"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>SIGN IN / REGISTER</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Visible only on mobile/tablet screens < md when logged in) */}
      {currentUser && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/85 backdrop-blur-lg border-t border-white/5 px-4 py-2 flex items-center justify-around">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex flex-col items-center gap-1 py-1 px-3 min-w-[60px]"
              >
                <Icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-goldAccent scale-105' : 'text-textSub'}`} />
                <span className={`text-[9px] font-bold tracking-wider ${isActive ? 'text-goldAccent' : 'text-textSub'}`}>
                  {link.label}
                </span>
              </button>
            );
          })}

          {/* Mobile Watchlist Toggle */}
          <button
            onClick={onToggleSidebar}
            className="flex flex-col items-center gap-1 py-1 px-3 min-w-[60px] relative"
          >
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500/10" />
            <span className="text-[9px] font-bold tracking-wider text-textSub">Watchlist</span>
            {watchlist.length > 0 && (
              <span className="absolute top-0 right-3 bg-goldAccent text-cinemaBlack font-black text-[9px] px-1.5 py-0.5 rounded-full">
                {watchlist.length}
              </span>
            )}
          </button>
        </div>
      )}
    </>
  );
}
