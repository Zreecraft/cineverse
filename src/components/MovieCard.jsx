import { motion } from 'framer-motion';
import { Star, Plus, Check, Play } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export default function MovieCard({ movie, onOpenDetails, onPlayTrailer, onAddToWatchlist, currentUser, onRequireAuth }) {
  const { watchlist } = useWatchlist();
  const isInWatchlist = watchlist.some((m) => m.id === movie.id);

  return (
    <motion.div
      whileHover={{ 
        scale: 1.04,
        y: -6,
        boxShadow: '0 25px 40px -5px rgba(0,0,0,0.8), 0 0 25px rgba(251,191,36,0.08)'
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl overflow-hidden aspect-[2/3] bg-neutral-900 border border-white/5 cursor-pointer group"
      onClick={() => onOpenDetails(movie)}
    >
      {/* Poster Image — per-film object-position support */}
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ objectPosition: movie.posterPosition || 'center top' }}
        loading="lazy"
      />

      {/* Always-visible: Title + Rating badge at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 z-10 translate-y-0">
        <h3 className="text-xs font-bold text-white leading-snug line-clamp-1 mb-0.5">{movie.title}</h3>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-goldAccent text-goldAccent" />
          <span className="text-[10px] font-bold text-goldAccent">{movie.rating}</span>
          <span className="text-[9px] text-textSub ml-1">• {movie.releaseYear}</span>
        </div>
      </div>

      {/* Hover Overlay — clean: big rating stars + Trailer button */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4 z-20 px-3">

        {/* Big Star Rating */}
        <div className="flex flex-col items-center gap-1.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${s <= Math.round(movie.rating) ? 'fill-goldAccent text-goldAccent' : 'text-white/20'}`}
              />
            ))}
          </div>
          <span className="text-base font-black text-goldAccent font-display">{movie.rating}</span>
          <span className="text-[9px] text-textSub font-semibold">{movie.genres.slice(0,2).join(' / ')}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-full transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 ease-out delay-75">
          {/* Trailer Button — primary action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayTrailer(movie);
            }}
            className="w-full py-2 rounded-xl bg-goldAccent text-cinemaBlack font-bold text-[11px] flex items-center justify-center gap-1.5 hover:bg-yellow-300 transition-colors shadow-gold-glow"
          >
            <Play className="w-3.5 h-3.5 fill-cinemaBlack text-cinemaBlack" />
            <span>PLAY TRAILER</span>
          </button>

          {/* Watchlist button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToWatchlist(movie);
            }}
            className={`w-full py-1.5 rounded-xl border text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              isInWatchlist && currentUser
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : 'border-white/20 text-white/70 hover:text-white hover:border-white/40'
            }`}
          >
            {isInWatchlist && currentUser ? (
              <><Check className="w-3 h-3" /><span>Di Watchlist</span></>
            ) : (
              <><Plus className="w-3 h-3" /><span>+ Watchlist</span></>
            )}
          </button>
        </div>

      </div>
    </motion.div>
  );
}
