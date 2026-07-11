import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Play, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export default function Hero({ onPlayTrailer, onAddToWatchlist, currentUser, onRequireAuth, movies }) {
  const { watchlist } = useWatchlist();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter 3 popular movies for hero showcase
  const featuredMovies = movies.filter(m => 
    m.id === 'agak-laen' || m.id === 'dilan-1990' || m.id === 'mencuri-raden-saleh'
  ).slice(0, 3);

  // Auto rotate carousel every 8 seconds
  useEffect(() => {
    if (featuredMovies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[currentIndex];
  const isInWatchlist = watchlist.some((m) => m.id === currentMovie.id);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  return (
    <div className="relative w-full h-[85vh] sm:h-screen overflow-hidden flex items-end">
      
      {/* Background Slides with AnimatePresence */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovie.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.55, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <img
              src={currentMovie.backdropImage || currentMovie.poster}
              alt={currentMovie.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Dark Vignettes to merge background with black website */}
        <div className="absolute inset-0 hero-vignette z-1"></div>
        <div className="absolute inset-0 hero-side-vignette z-1"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 flex items-end justify-between gap-8">
        
        <motion.div
          key={currentMovie.id}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-8 text-left space-y-5 max-w-3xl"
        >
          {/* Badge & Rating */}
          <div className="flex items-center gap-3">
            <span className="bg-goldAccent/10 text-goldAccent border border-goldAccent/30 px-3 py-1 rounded-full text-xs font-semibold tracking-widest font-display">
              CINEMATIC BLOCKBUSTER
            </span>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4.5 h-4.5 fill-goldAccent text-goldAccent drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
              ))}
              <span className="text-sm font-semibold ml-1.5 text-white">{currentMovie.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-white drop-shadow-md">
            {currentMovie.title}
          </h1>

          {/* Credits info */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-textSub">
            <p>Sutradara: <span className="text-white font-medium">{currentMovie.director}</span></p>
            <span className="hidden sm:inline w-1 h-1 bg-textSub rounded-full"></span>
            <p>Durasi: <span className="text-white font-medium">{currentMovie.duration}</span></p>
            <span className="hidden sm:inline w-1 h-1 bg-textSub rounded-full"></span>
            <p>Tahun: <span className="text-white font-medium">{currentMovie.releaseYear}</span></p>
          </div>

          {/* Synopsis */}
          <p className="text-textSub text-sm sm:text-base max-w-2xl font-light leading-relaxed drop-shadow-md">
            {currentMovie.synopsisShort || currentMovie.synopsis}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPlayTrailer(currentMovie)}
              className="px-6 py-3.5 rounded-xl bg-goldAccent text-cinemaBlack font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors shadow-gold-glow"
            >
              <Play className="w-4.5 h-4.5 fill-cinemaBlack text-cinemaBlack" />
              <span>PLAY TRAILER</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAddToWatchlist(currentMovie)}
              className={`px-6 py-3.5 rounded-xl border font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                isInWatchlist && currentUser
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : 'border-white/20 text-white hover:border-white/40'
              }`}
            >
              {isInWatchlist && currentUser ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>IN WATCHLIST</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>+ WATCHLIST</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Carousel controls - arrows (bottom right on desktop) */}
        <div className="hidden md:flex items-center gap-2 bg-black/40 border border-white/5 p-1.5 rounded-full backdrop-blur-md">
          <button 
            onClick={handlePrev}
            className="p-2 rounded-full text-textSub hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-1.5 px-1">
            {featuredMovies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'bg-goldAccent w-4' : 'bg-white/20'
                }`}
              ></button>
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="p-2 rounded-full text-textSub hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
