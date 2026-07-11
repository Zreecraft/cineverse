import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Clock, User, Star } from 'lucide-react';

export default function TrailerModal({ isOpen, movie, onClose }) {
  if (!movie) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-4xl bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-10 aspect-video md:aspect-auto"
          >
            {/* Left side: Video Embed */}
            <div className="flex-grow aspect-video bg-black relative md:w-[65%]">
              <iframe
                src={`https://www.youtube.com/embed/${movie.youtubeId}?autoplay=1`}
                title={`${movie.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full absolute inset-0"
              ></iframe>
            </div>

            {/* Right side: Movie Info (Hidden on mobile to save space) */}
            <div className="hidden md:flex flex-col justify-between p-6 md:w-[35%] border-l border-white/5 text-left space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h2 className="font-display font-black text-xl text-white tracking-wide">
                    {movie.title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-white/5 text-textSub hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <span 
                      key={g} 
                      className="text-[9px] font-semibold font-display tracking-widest bg-goldAccent/10 text-goldAccent border border-goldAccent/20 px-2 py-0.5 rounded-full"
                    >
                      {g.toUpperCase()}
                    </span>
                  ))}
                </div>

                <div className="space-y-2 text-xs text-textSub">
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 fill-goldAccent text-goldAccent" />
                    <span className="text-white font-bold">{movie.rating} / 5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{movie.duration} • {movie.releaseYear}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-2 border-t border-white/5">
                    <User className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <p>Sutradara: <span className="text-white">{movie.director}</span></p>
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-white/5">
                  <h4 className="text-xs font-semibold text-white">Sinopsis</h4>
                  <p className="text-[11px] text-textSub leading-relaxed line-clamp-4">
                    {movie.synopsis}
                  </p>
                </div>
              </div>

              <div className="text-[10px] text-textSub border-t border-white/5 pt-3">
                <p className="truncate">Cast: {movie.cast.join(', ')}</p>
              </div>
            </div>

            {/* Mobile close button (floating at top-right) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 md:hidden p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white"
            >
              <X className="w-5 h-5" />
            </button>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
