import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Calendar, Clock, Heart, MessageSquare, Plus, Check, Play } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export default function MovieDetailModal({ isOpen, onClose, movie, onPlayTrailer, onBookTicket, currentUser, onRequireAuth }) {
  const { watchlist, addToWatchlist } = useWatchlist();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // Load reviews from localStorage
  useEffect(() => {
    if (movie) {
      const savedReviews = localStorage.getItem(`cv_reviews_${movie.id}`);
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      } else {
        // Initial mock reviews
        const mockReviews = [
          { id: '1', user: 'Rian_FilmFreak', rating: 5, comment: 'Salah satu film terbaik! Aktingnya luar biasa dan jalan ceritanya sangat menyentuh.', date: '12 Jan 2026' },
          { id: '2', user: 'CinemaLover', rating: 4, comment: 'Sangat menghibur, leluconnya pas dan dramatisasinya dapet banget.', date: '29 Feb 2026' }
        ];
        localStorage.setItem(`cv_reviews_${movie.id}`, JSON.stringify(mockReviews));
        setReviews(mockReviews);
      }
    }
  }, [movie]);

  if (!movie) return null;

  const isInWatchlist = watchlist.some((m) => m.id === movie.id);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireAuth();
      return;
    }
    if (!comment.trim()) return;

    const newReview = {
      id: Date.now().toString(),
      user: currentUser.name,
      rating,
      comment,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`cv_reviews_${movie.id}`, JSON.stringify(updatedReviews));
    setComment('');
    setRating(5);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/95 cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 my-8 flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible"
          >
            {/* Left: Poster and Quick Actions */}
            <div className="md:w-[40%] relative aspect-[2/3] md:aspect-auto md:min-h-[550px] bg-neutral-900 border-r border-white/5 flex flex-col">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover md:absolute md:inset-0"
                style={{ objectPosition: movie.posterPosition || 'center top' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent flex flex-col justify-end p-6 md:z-10">
                <div className="space-y-3">
                  <button
                    onClick={() => onPlayTrailer(movie)}
                    className="w-full py-3.5 rounded-xl bg-goldAccent text-cinemaBlack font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors shadow-gold-glow"
                  >
                    <Play className="w-4.5 h-4.5 fill-cinemaBlack text-cinemaBlack" />
                    <span>PLAY TRAILER</span>
                  </button>
                </div>
              </div>
              
              {/* Close Button on Mobile */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 md:hidden p-2 rounded-full bg-black/60 border border-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Right: Details, Reviews and Scrollable Area */}
            <div className="md:w-[60%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto text-left h-[50vh] md:h-[600px]">
              <div className="space-y-6">
                
                {/* Header title */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black font-display tracking-wide text-white">
                      {movie.title}
                    </h2>
                    {movie.subtitle && (
                      <p className="text-xs text-goldAccent font-semibold tracking-wider uppercase mt-1">{movie.subtitle}</p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="hidden md:block p-1.5 rounded-lg hover:bg-white/5 text-textSub hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Rating and Metadata Tags */}
                <div className="flex flex-wrap gap-3 items-center text-xs text-textSub">
                  <div className="flex items-center gap-1 bg-goldAccent/10 text-goldAccent px-2.5 py-1 rounded-lg border border-goldAccent/20">
                    <Star className="w-3.5 h-3.5 fill-goldAccent" />
                    <span className="font-bold">{movie.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{movie.releaseYear}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{movie.duration}</span>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <span
                      key={g}
                      className="text-[9px] font-bold font-display tracking-widest border border-white/10 bg-white/[0.02] text-textSub px-2.5 py-1 rounded-full uppercase"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                {/* Crew Details */}
                <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-white/5">
                  <div>
                    <span className="text-textSub uppercase font-semibold tracking-wider text-[10px]">SUTRADARA</span>
                    <p className="text-white font-medium mt-0.5">{movie.director}</p>
                  </div>
                  <div>
                    <span className="text-textSub uppercase font-semibold tracking-wider text-[10px]">PRODUSER</span>
                    <p className="text-white font-medium mt-0.5">{movie.producer || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-textSub uppercase font-semibold tracking-wider text-[10px]">PEMERAN UTAMA</span>
                    <p className="text-white font-medium mt-0.5 line-clamp-1">{movie.cast.join(', ')}</p>
                  </div>
                </div>

                {/* Synopsis */}
                <div className="space-y-1.5 text-xs">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Sinopsis</h4>
                  <p className="text-textSub leading-relaxed text-justify">{movie.synopsis}</p>
                </div>

                {/* Watchlist Toggle */}
                <div className="pt-2">
                  <button
                    onClick={() => addToWatchlist(movie, onRequireAuth)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      isInWatchlist && currentUser
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                        : 'border-white/10 text-white hover:border-white/20'
                    }`}
                  >
                    {isInWatchlist && currentUser ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>SUDAH DI WATCHLIST</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>TAMBAH KE WATCHLIST</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Reviews Section */}
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <h3 className="font-display font-bold text-sm tracking-wide text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-goldAccent" />
                    <span>Ulasan Pengguna ({reviews.length})</span>
                  </h3>

                  {/* Add Review Form */}
                  {currentUser ? (
                    <form onSubmit={handleSubmitReview} className="space-y-3.5 bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-textSub">Beri Rating:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="text-goldAccent hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  star <= (hoverRating || rating)
                                    ? 'fill-goldAccent'
                                    : 'text-textSub opacity-40'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        rows="2"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tulis ulasan Anda tentang film ini..."
                        className="w-full bg-black/60 border border-white/10 focus:border-goldAccent focus:ring-1 focus:ring-goldAccent/30 rounded-xl p-3 text-xs text-white placeholder-textSub focus:outline-none transition-all"
                      ></textarea>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-goldAccent text-cinemaBlack font-bold text-xs rounded-lg hover:bg-amber-400 transition-colors"
                        >
                          Kirim Ulasan
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-white/[0.01] border border-dashed border-white/10 p-4 rounded-2xl text-center">
                      <p className="text-xs text-textSub">
                        Silakan{' '}
                        <button type="button" onClick={onRequireAuth} className="text-goldAccent font-bold hover:underline">
                          Login
                        </button>{' '}
                        untuk menulis ulasan film ini.
                      </p>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-3">
                    {reviews.length > 0 ? (
                      reviews.map((rev) => (
                        <div key={rev.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-goldAccent/10 border border-goldAccent/30 flex items-center justify-center text-[10px] text-goldAccent font-bold">
                                {rev.user.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-white">{rev.user}</span>
                            </div>
                            <span className="text-[10px] text-textSub">{rev.date}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating ? 'fill-goldAccent text-goldAccent' : 'text-textSub opacity-20'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-textSub leading-relaxed pl-1 text-left">{rev.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-textSub italic py-4">Belum ada ulasan untuk film ini.</p>
                    )}
                  </div>

                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
