import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Play, Star, Film } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export default function WatchlistSidebar({ isOpen, onClose, onPlayTrailer, onOpenDetails }) {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black"
          />

          {/* Sliding Watchlist Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[380px] bg-cinemaBlack/95 backdrop-blur-md border-l border-white/10 p-6 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-goldAccent"></span>
                <h2 className="font-display font-bold text-lg tracking-wide text-white">Watchlist Saya</h2>
                <span className="bg-neutral-800 text-goldAccent font-bold text-xs px-2 py-0.5 rounded-full ml-1.5">
                  {watchlist.length}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/5 text-textSub hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Watchlist Items */}
            <div className="flex-grow overflow-y-auto space-y-4 pr-1">
              {watchlist.length > 0 ? (
                watchlist.map((movie) => (
                  <motion.div
                    layout
                    key={movie.id}
                    className="flex gap-4 p-2 rounded-xl bg-white/5 border border-white/5 hover:border-goldAccent/20 transition-all duration-300 group"
                  >
                    {/* Small vertical poster */}
                    <div 
                      onClick={() => onOpenDetails(movie)}
                      className="w-16 h-24 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer bg-neutral-900 border border-white/10"
                    >
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Movie Info */}
                    <div className="flex-grow flex flex-col justify-between text-left">
                      <div className="space-y-1">
                        <h3 
                          onClick={() => onOpenDetails(movie)}
                          className="font-bold text-sm text-white hover:text-goldAccent cursor-pointer transition-colors line-clamp-1"
                        >
                          {movie.title}
                        </h3>
                        <p className="text-[10px] text-textSub font-semibold">
                          {movie.releaseYear} • {movie.duration}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-goldAccent text-goldAccent" />
                          <span className="text-[10px] font-bold text-goldAccent">{movie.rating}</span>
                        </div>
                      </div>

                      {/* Small Quick Actions */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => onPlayTrailer(movie)}
                          className="text-[10px] font-bold text-goldAccent hover:text-yellow-400 flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Trailer</span>
                        </button>
                        
                        <button
                          onClick={() => removeFromWatchlist(movie.id, movie.title)}
                          className="text-[10px] font-bold text-rose-500 hover:text-rose-400 flex items-center gap-1 ml-auto opacity-60 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                /* Empty state */
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-textSub">
                    <Film className="w-6 h-6 opacity-30" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-white">Watchlist Kosong</p>
                    <p className="text-xs text-textSub max-w-[200px] leading-relaxed">
                      Tambahkan film favorit Anda ke watchlist untuk ditonton nanti.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Panel */}
            {watchlist.length > 0 && (
              <div className="border-t border-white/10 pt-4 mt-4 space-y-3">
                <button
                  onClick={() => {
                    onPlayTrailer(watchlist[0]);
                  }}
                  className="w-full py-3 rounded-xl bg-goldAccent text-cinemaBlack font-semibold text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors"
                >
                  <Play className="w-4 h-4 fill-cinemaBlack text-cinemaBlack" />
                  <span>MARATHON SEKARANG</span>
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
