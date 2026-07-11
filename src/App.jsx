import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, Filter, TrendingUp, Star, Grid } from 'lucide-react';
import { WatchlistProvider, useWatchlist } from './context/WatchlistContext';
import { moviesData } from './data/moviesData';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieCard from './components/MovieCard';
import WatchlistSidebar from './components/WatchlistSidebar';
import TrailerModal from './components/TrailerModal';
import AuthModal from './components/AuthModal';
import MovieDetailModal from './components/MovieDetailModal';
import AdminDashboard from './components/AdminDashboard';

// =====================
// Notification Toast
// =====================
function Toast({ notification }) {
  const themeMap = {
    success: { border: 'border-emerald-500/40', text: 'text-emerald-400', Icon: CheckCircle2 },
    warning: { border: 'border-goldAccent/40',  text: 'text-goldAccent',  Icon: AlertCircle },
    info:    { border: 'border-sky-400/40',     text: 'text-sky-400',     Icon: Info },
  };
  const t = themeMap[notification.type] || themeMap.success;
  const Icon = t.Icon;
  return (
    <AnimatePresence>
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.92 }}
          className={`fixed top-24 right-6 z-[100] bg-zinc-950/90 border ${t.border} backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-lg flex items-center gap-3 max-w-xs`}
        >
          <Icon className={`w-5 h-5 flex-shrink-0 ${t.text}`} />
          <p className="text-sm font-semibold text-white truncate">{notification.message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =====================
// Reusable Movie Grid Section
// =====================
function MovieSection({ title, movies, icon: Icon, onPlayTrailer, onOpenDetails, onAddToWatchlist, currentUser, onRequireAuth, emptyMessage }) {
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } }
  };
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5 text-left">
          {Icon && <Icon className="w-5 h-5 text-goldAccent" />}
          <h2 className="text-xl sm:text-2xl font-black tracking-wide text-white font-display">{title}</h2>
        </div>
        <span className="text-xs text-textSub font-semibold">{movies.length} film</span>
      </div>
      {movies.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        >
          {movies.map((movie) => (
            <motion.div key={movie.id} variants={itemVariants}>
              <MovieCard
                movie={movie}
                onPlayTrailer={onPlayTrailer}
                onOpenDetails={onOpenDetails}
                onAddToWatchlist={onAddToWatchlist}
                currentUser={currentUser}
                onRequireAuth={onRequireAuth}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="py-20 text-center space-y-3">
          <p className="text-4xl">🎬</p>
          <p className="text-sm text-textSub font-medium">{emptyMessage || 'Film tidak ditemukan.'}</p>
        </div>
      )}
    </section>
  );
}

// =====================
// Page: Home
// =====================
function HomePage({ movies, onPlayTrailer, onOpenDetails, onAddToWatchlist, currentUser, onRequireAuth, searchTerm, selectedGenre }) {
  const isFiltering = searchTerm !== '' || selectedGenre !== 'All';

  const filtered = (arr) => arr.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        m.director.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGenre  = selectedGenre === 'All' || m.genres.includes(selectedGenre);
    return matchSearch && matchGenre;
  });

  const trendingMovies = movies.filter((m) => m.trending);
  const topRatedMovies = movies.filter((m) => m.topRated);

  return (
    <>
      {/* Auto-rotating Hero Carousel using Dynamic Movies */}
      {!isFiltering && (
        <Hero
          movies={movies}
          onPlayTrailer={onPlayTrailer}
          onAddToWatchlist={onAddToWatchlist}
          currentUser={currentUser}
          onRequireAuth={onRequireAuth}
        />
      )}

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-14 ${isFiltering ? 'pt-28' : 'pt-10'}`}>
        {isFiltering ? (
          <MovieSection
            title={`Hasil Pencarian${selectedGenre !== 'All' ? ` · ${selectedGenre}` : ''}${searchTerm ? ` · "${searchTerm}"` : ''}`}
            movies={filtered(movies)}
            icon={Filter}
            onPlayTrailer={onPlayTrailer}
            onOpenDetails={onOpenDetails}
            onAddToWatchlist={onAddToWatchlist}
            currentUser={currentUser}
            onRequireAuth={onRequireAuth}
            emptyMessage="Film tidak ditemukan. Coba kata kunci atau genre lain."
          />
        ) : (
          <>
            <MovieSection
              title="Trending di Indonesia"
              icon={TrendingUp}
              movies={filtered(trendingMovies)}
              onPlayTrailer={onPlayTrailer}
              onOpenDetails={onOpenDetails}
              onAddToWatchlist={onAddToWatchlist}
              currentUser={currentUser}
              onRequireAuth={onRequireAuth}
            />
            <MovieSection
              title="Rating Tertinggi"
              icon={Star}
              movies={filtered(topRatedMovies)}
              onPlayTrailer={onPlayTrailer}
              onOpenDetails={onOpenDetails}
              onAddToWatchlist={onAddToWatchlist}
              currentUser={currentUser}
              onRequireAuth={onRequireAuth}
            />
          </>
        )}
      </div>
    </>
  );
}

// =====================
// Page: Trending
// =====================
function TrendingPage({ movies, onPlayTrailer, onOpenDetails, onAddToWatchlist, currentUser, onRequireAuth }) {
  const trendingMovies = movies.filter((m) => m.trending);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-10">
      <div className="text-left space-y-2 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-goldAccent/10 border border-goldAccent/20">
            <TrendingUp className="w-5 h-5 text-goldAccent" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-display">Trending Sekarang</h1>
        </div>
        <p className="text-sm text-textSub font-medium">Film-film yang paling banyak ditonton dan dibicarakan saat ini.</p>
      </div>

      <MovieSection
        title=""
        movies={trendingMovies}
        onPlayTrailer={onPlayTrailer}
        onOpenDetails={onOpenDetails}
        onAddToWatchlist={onAddToWatchlist}
        currentUser={currentUser}
        onRequireAuth={onRequireAuth}
        emptyMessage="Tidak ada film trending saat ini."
      />
    </div>
  );
}

// =====================
// Page: Genres
// =====================
function GenresPage({ movies, onPlayTrailer, onOpenDetails, onAddToWatchlist, currentUser, onRequireAuth }) {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const allGenres = [...new Set(movies.flatMap((m) => m.genres))].sort();

  const genreGroups = allGenres.map((genre) => ({
    genre,
    movies: movies.filter((m) => m.genres.includes(genre)),
  }));

  const genreColors = {
    'Aksi':        'from-red-900/40 to-red-950/80 border-red-500/20 text-red-400',
    'Animasi':     'from-purple-900/40 to-purple-950/80 border-purple-500/20 text-purple-400',
    'Drama':       'from-blue-900/40 to-blue-950/80 border-blue-500/20 text-blue-400',
    'Fantasi':     'from-fuchsia-900/40 to-fuchsia-950/80 border-fuchsia-500/20 text-fuchsia-400',
    'Horor':       'from-zinc-900/40 to-zinc-950/80 border-zinc-500/20 text-zinc-300',
    'Keluarga':    'from-green-900/40 to-green-950/80 border-green-500/20 text-green-400',
    'Komedi':      'from-yellow-900/40 to-yellow-950/80 border-goldAccent/20 text-goldAccent',
    'Kriminal':    'from-orange-900/40 to-orange-950/80 border-orange-500/20 text-orange-400',
    'Petualangan': 'from-cyan-900/40 to-cyan-950/80 border-cyan-500/20 text-cyan-400',
    'Romansa':     'from-pink-900/40 to-pink-950/80 border-pink-500/20 text-pink-400',
    'Sejarah':     'from-amber-900/40 to-amber-950/80 border-amber-500/20 text-amber-400',
    'Thriller':    'from-slate-900/40 to-slate-950/80 border-slate-500/20 text-slate-300',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-10">
      <div className="text-left space-y-2 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-goldAccent/10 border border-goldAccent/20">
            <Grid className="w-5 h-5 text-goldAccent" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-display">Semua Genre</h1>
        </div>
        <p className="text-sm text-textSub font-medium">Jelajahi film berdasarkan kategori genre.</p>
      </div>

      {!selectedGenre ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {genreGroups.map(({ genre, movies }) => {
            const colorClass = genreColors[genre] || 'from-zinc-900/40 to-zinc-950/80 border-zinc-500/20 text-zinc-300';
            return (
              <motion.button
                key={genre}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedGenre(genre)}
                className={`bg-gradient-to-br ${colorClass} border rounded-2xl p-5 text-left space-y-2 transition-all duration-300 hover:shadow-lg`}
              >
                <span className="text-xl">
                  {genre === 'Aksi' ? '⚔️' : genre === 'Animasi' ? '🎨' : genre === 'Drama' ? '🎭' :
                   genre === 'Fantasi' ? '✨' : genre === 'Horor' ? '👻' : genre === 'Keluarga' ? '👨‍👩‍👧' :
                   genre === 'Komedi' ? '😂' : genre === 'Kriminal' ? '🔫' : genre === 'Petualangan' ? '🗺️' :
                   genre === 'Romansa' ? '❤️' : genre === 'Sejarah' ? '🏛️' : '🎬'}
                </span>
                <div>
                  <p className="font-bold text-white text-sm">{genre}</p>
                  <p className="text-[11px] text-textSub font-semibold">{movies.length} film</p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedGenre(null)}
              className="text-xs text-textSub hover:text-goldAccent border border-white/10 hover:border-goldAccent/40 px-3 py-1.5 rounded-full transition-colors font-semibold"
            >
              ← Semua Genre
            </button>
            <span className="text-sm text-textSub">→</span>
            <span className="text-sm font-bold text-white">{selectedGenre}</span>
          </div>
          <MovieSection
            title={`Genre: ${selectedGenre}`}
            movies={movies.filter((m) => m.genres.includes(selectedGenre))}
            onPlayTrailer={onPlayTrailer}
            onOpenDetails={onOpenDetails}
            onAddToWatchlist={onAddToWatchlist}
            currentUser={currentUser}
            onRequireAuth={onRequireAuth}
          />
        </motion.div>
      )}
    </div>
  );
}

// =====================
// Inner Dashboard
// =====================
function DashboardContent({ movies, setMovies, currentUser, onOpenAuth, onLogout }) {
  const { notification, addToWatchlist } = useWatchlist();
  const [activeTab, setActiveTab] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modalMovie, setModalMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Custom detail modal state
  const [detailMovie, setDetailMovie] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Safety: jika user biasa (CineVerse) login saat berada di tab admin,
  // arahkan ke Home. Admin sejati tidak pernah set currentUser.
  useEffect(() => {
    if (currentUser && activeTab === 'admin') {
      setActiveTab('home');
    }
  }, [currentUser]);

  const handleOpenTrailer = (movie) => {
    setModalMovie(movie);
    setIsModalOpen(true);
  };

  const handleOpenDetails = (movie) => {
    setDetailMovie(movie);
    setIsDetailOpen(true);
  };

  const handleAddToWatchlist = (movie) => {
    addToWatchlist(movie, onOpenAuth);
  };

  const toggleSidebar = () => {
    if (!currentUser) { onOpenAuth(); return; }
    setIsSidebarOpen((v) => !v);
  };

  const genresList = ['All', ...new Set(movies.flatMap((m) => m.genres))];

  return (
    <div className="min-h-screen bg-cinemaBlack text-white relative">
      <div className="filmstrip-grid"></div>

      <Toast notification={notification} />

      {/* Floating Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'home') {
            setSearchTerm('');
            setSelectedGenre('All');
          }
        }}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onToggleSidebar={toggleSidebar}
        currentUser={currentUser}
        onOpenAuth={onOpenAuth}
        onLogout={onLogout}
      />

      {/* Genre filter bar — only on home tab */}
      {activeTab === 'home' && (
        <div className="fixed top-20 left-0 right-0 z-40 bg-cinemaBlack/80 backdrop-blur-sm border-b border-white/5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto py-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {genresList.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`text-xs px-3.5 py-1.5 rounded-full border font-semibold whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                  selectedGenre === g
                    ? 'bg-goldAccent border-goldAccent text-cinemaBlack shadow-gold-glow'
                    : 'border-white/10 bg-neutral-900/40 text-textSub hover:text-white hover:border-white/20'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab Pages */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + (currentUser ? '-auth' : '-guest')}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          {/* Admin Tab with Role-Based Access Control */}
          {activeTab === 'admin' && (
            currentUser && currentUser.role === 'admin' ? (
              <AdminDashboard
                movies={movies}
                setMovies={setMovies}
                onLogout={onLogout}
              />
            ) : (
              <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-32">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-md bg-zinc-950 border border-red-500/20 rounded-3xl p-8 text-center shadow-2xl relative"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 rounded-t-3xl"></div>
                  <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-black font-display text-white tracking-wide">
                    ACCESS DENIED
                  </h2>
                  <p className="text-sm text-textSub mt-3 leading-relaxed">
                    Anda tidak memiliki akses ke halaman ini. Halaman Admin Dashboard hanya dapat diakses oleh Administrator resmi CineVerse.
                  </p>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold text-xs mt-8 transition-colors"
                  >
                    KEMBALI KE BERANDA
                  </button>
                </motion.div>
              </div>
            )
          )}

          {/* Guest Wall - shown to non-logged-in users on non-admin tabs */}
          {activeTab !== 'admin' && !currentUser && (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-32">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md text-center"
              >
                {/* Cinema Reel Icon */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-goldAccent/20 to-amber-600/10 animate-pulse"></div>
                  <div className="relative w-24 h-24 rounded-full bg-zinc-950 border border-goldAccent/20 flex items-center justify-center shadow-gold-glow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-goldAccent">
                      <circle cx="12" cy="12" r="10"/>
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                      <path d="m4.93 4.93 2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>
                    </svg>
                  </div>
                </div>

                <h1 className="text-3xl font-black font-display text-white tracking-tight mb-3">
                  Selamat Datang di <span className="text-goldAccent">CineVerse</span>
                </h1>
                <p className="text-sm text-textSub leading-relaxed mb-8">
                  Daftarkan akun kamu untuk menikmati pengalaman eksplorasi film sinematik—rating, trailer, dan koleksi watchlist personal kamu.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={onOpenAuth}
                    className="w-full py-3.5 rounded-2xl bg-goldAccent text-cinemaBlack font-bold text-sm tracking-wide hover:bg-amber-400 transition-colors shadow-gold-glow"
                  >
                    🎬 Daftar / Masuk Sekarang
                  </button>
                  <p className="text-[11px] text-textSub">
                    Atau klik menu <span className="text-goldAccent font-bold">Admin</span> di navbar untuk masuk sebagai admin.
                  </p>
                </div>

                {/* Feature previews */}
                <div className="grid grid-cols-3 gap-3 mt-10">
                  {[
                    { emoji: '⭐', label: 'Rating Film' },
                    { emoji: '🎞️', label: 'Trailer Video' },
                    { emoji: '❤️', label: 'Watchlist' },
                  ].map(({ emoji, label }) => (
                    <div key={label} className="bg-zinc-950 border border-white/5 rounded-2xl p-4 space-y-2">
                      <span className="text-2xl">{emoji}</span>
                      <p className="text-[10px] font-semibold text-textSub">{label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* Logged-in User Content */}
          {activeTab === 'home' && currentUser && (
            <div className="pt-10">
              <HomePage
                movies={movies}
                onPlayTrailer={handleOpenTrailer}
                onOpenDetails={handleOpenDetails}
                onAddToWatchlist={handleAddToWatchlist}
                currentUser={currentUser}
                onRequireAuth={onOpenAuth}
                searchTerm={searchTerm}
                selectedGenre={selectedGenre}
              />
            </div>
          )}

          {activeTab === 'trending' && currentUser && (
            <TrendingPage
              movies={movies}
              onPlayTrailer={handleOpenTrailer}
              onOpenDetails={handleOpenDetails}
              onAddToWatchlist={handleAddToWatchlist}
              currentUser={currentUser}
              onRequireAuth={onOpenAuth}
            />
          )}

          {activeTab === 'genres' && currentUser && (
            <GenresPage
              movies={movies}
              onPlayTrailer={handleOpenTrailer}
              onOpenDetails={handleOpenDetails}
              onAddToWatchlist={handleAddToWatchlist}
              currentUser={currentUser}
              onRequireAuth={onOpenAuth}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Watchlist Sidebar Drawer */}
      <WatchlistSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onPlayTrailer={handleOpenTrailer}
        onOpenDetails={handleOpenDetails}
      />

      {/* Trailer Playback Modal */}
      <TrailerModal
        isOpen={isModalOpen}
        movie={modalMovie}
        onClose={() => { setIsModalOpen(false); setModalMovie(null); }}
      />

      {/* Movie Details Modal (with Reviews) */}
      <MovieDetailModal
        isOpen={isDetailOpen}
        movie={detailMovie}
        onClose={() => { setIsDetailOpen(false); setDetailMovie(null); }}
        onPlayTrailer={handleOpenTrailer}
        currentUser={currentUser}
        onRequireAuth={onOpenAuth}
      />
    </div>
  );
}

// =====================
// Root App with Auth Gate
// =====================
export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cv_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Manage dynamic movies list in local storage
  const [movies, setMovies] = useState(() => {
    const savedMovies = localStorage.getItem('cv_movies');
    return savedMovies ? JSON.parse(savedMovies) : moviesData;
  });

  // Sync dynamic movies to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cv_movies', JSON.stringify(movies));
  }, [movies]);

  const handleLogin = (user) => setCurrentUser(user);

  const handleLogout = () => {
    localStorage.removeItem('cv_current_user');
    setCurrentUser(null);
  };

  return (
    <WatchlistProvider currentUser={currentUser}>
      <DashboardContent
        movies={movies}
        setMovies={setMovies}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
      />
    </WatchlistProvider>
  );
}
