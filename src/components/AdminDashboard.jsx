import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, Search, LogOut, Film, Calendar, Clock, 
  Play, Lock, Mail, Check, AlertCircle, RefreshCw, X, Shield 
} from 'lucide-react';

export default function AdminDashboard({ movies, setMovies, onLogout }) {
  // Dashboard states
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  
  // YouTube trailer playback state
  const [previewMovie, setPreviewMovie] = useState(null);

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    releaseYear: '',
    duration: '',
    rating: '5.0',
    genres: '',
    director: '',
    producer: '',
    cast: '',
    poster: '',
    backdropImage: '',
    synopsis: '',
    youtubeId: ''
  });

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingMovie(null);
    setFormData({
      title: '',
      subtitle: '',
      releaseYear: new Date().getFullYear().toString(),
      duration: '',
      rating: '4.5',
      genres: '',
      director: '',
      producer: '',
      cast: '',
      poster: '/posters/poster.jpg', // Default template path
      backdropImage: '/posters/poster.jpg',
      synopsis: '',
      youtubeId: ''
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || '',
      subtitle: movie.subtitle || '',
      releaseYear: movie.releaseYear?.toString() || '',
      duration: movie.duration || '',
      rating: movie.rating?.toString() || '4.5',
      genres: movie.genres?.join(', ') || '',
      director: movie.director || '',
      producer: movie.producer || '',
      cast: movie.cast?.join(', ') || '',
      poster: movie.poster || '',
      backdropImage: movie.backdropImage || '',
      synopsis: movie.synopsis || '',
      youtubeId: movie.youtubeId || ''
    });
    setIsModalOpen(true);
  };

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Submit (Add or Edit)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    // Convert comma-separated string to arrays
    const genresArray = formData.genres
      ? formData.genres.split(',').map(g => g.trim()).filter(Boolean)
      : ['Drama'];
    const castArray = formData.cast
      ? formData.cast.split(',').map(c => c.trim()).filter(Boolean)
      : [];

    // Extract YouTube ID if full URL is pasted
    let ytId = formData.youtubeId.trim();
    if (ytId.includes('youtube.com') || ytId.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = ytId.match(regExp);
      if (match && match[2].length === 11) {
        ytId = match[2];
      }
    }

    const moviePayload = {
      id: editingMovie ? editingMovie.id : formData.title.toLowerCase().replace(/\s+/g, '-'),
      title: formData.title,
      subtitle: formData.subtitle,
      releaseYear: parseInt(formData.releaseYear) || new Date().getFullYear(),
      duration: formData.duration || '2 Jam',
      rating: parseFloat(formData.rating) || 5.0,
      genres: genresArray,
      director: formData.director || 'Sutradara',
      producer: formData.producer || 'Produser',
      cast: castArray,
      poster: formData.poster || '/posters/poster.jpg',
      backdropImage: formData.backdropImage || formData.poster || '/posters/poster.jpg',
      synopsis: formData.synopsis,
      youtubeId: ytId,
      trending: editingMovie ? editingMovie.trending : false,
      topRated: parseFloat(formData.rating) >= 4.7,
      featured: editingMovie ? editingMovie.featured : false
    };

    if (editingMovie) {
      // Edit mode
      setMovies(prev => prev.map(m => m.id === editingMovie.id ? moviePayload : m));
    } else {
      // Add mode
      setMovies(prev => [...prev, moviePayload]);
    }

    setIsModalOpen(false);
    setEditingMovie(null);
  };

  // Handle Delete Film
  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus film ini?')) {
      setMovies(prev => prev.filter(m => m.id !== id));
    }
  };

  // Filter movies by search term
  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.director.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to extract YouTube embed URL safely
  const getEmbedUrl = (ytId) => {
    return `https://www.youtube.com/embed/${ytId}?autoplay=1`;
  };

  // --- RENDERING ADMIN MAIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-cinemaBlack text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-950 border border-white/5 p-6 rounded-3xl mb-8">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-[10px] font-bold text-emerald-400 tracking-widest font-display">ADMIN SESSION ACTIVE</p>
          </div>
          <h1 className="text-2xl font-black font-display tracking-tight text-white mt-1">
            Welcome, <span className="text-goldAccent">Admin</span>
          </h1>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 font-bold text-xs rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>KELUAR</span>
        </button>
      </div>

      {/* Control Area: Search & Add Movie */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-textSub" />
          </span>
          <input
            type="text"
            placeholder="Cari judul atau sutradara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-white/10 hover:border-white/20 focus:border-goldAccent focus:ring-1 focus:ring-goldAccent/30 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-textSub focus:outline-none transition-all"
          />
        </div>

        {/* Add Movie Trigger */}
        <button
          onClick={handleOpenAddModal}
          className="w-full md:w-auto px-6 py-2.5 bg-goldAccent text-cinemaBlack font-bold text-xs tracking-wider rounded-xl flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors shadow-gold-glow"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>TAMBAH FILM BARU</span>
        </button>
      </div>

      {/* Movies Table / List */}
      <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] text-textSub font-bold tracking-widest font-display uppercase">
                <th className="py-4.5 px-6">FILM / POSTER</th>
                <th className="py-4.5 px-6">TAHUN</th>
                <th className="py-4.5 px-6">DURASI</th>
                <th className="py-4.5 px-6">GENRE</th>
                <th className="py-4.5 px-6">SUTRADARA</th>
                <th className="py-4.5 px-6">TRAILER</th>
                <th className="py-4.5 px-6 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-textSub">
              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-white/[0.01] transition-colors">
                    {/* Poster + Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-14 rounded-lg bg-neutral-900 overflow-hidden border border-white/10 flex-shrink-0 relative">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                            style={{ objectPosition: movie.posterPosition || 'center top' }}
                          />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-white text-sm line-clamp-1">{movie.title}</p>
                          {movie.subtitle && (
                            <p className="text-[10px] text-goldAccent mt-0.5 uppercase font-semibold">{movie.subtitle}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {/* Year */}
                    <td className="py-4 px-6 text-white font-medium">{movie.releaseYear}</td>
                    
                    {/* Duration */}
                    <td className="py-4 px-6 text-white font-medium">{movie.duration}</td>
                    
                    {/* Genres */}
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {movie.genres.map(g => (
                          <span key={g} className="bg-white/5 border border-white/5 text-[9px] px-2 py-0.5 rounded-full text-white">
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Director */}
                    <td className="py-4 px-6 text-white font-medium">{movie.director}</td>

                    {/* YouTube Trailer preview trigger */}
                    <td className="py-4 px-6">
                      {movie.youtubeId ? (
                        <button
                          onClick={() => setPreviewMovie(movie)}
                          className="flex items-center gap-1 bg-goldAccent/10 text-goldAccent px-2.5 py-1.5 rounded-lg border border-goldAccent/20 hover:bg-goldAccent/20 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 fill-goldAccent" />
                          <span>Play</span>
                        </button>
                      ) : (
                        <span className="text-[10px] italic text-white/30">No Link</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(movie)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white transition-colors"
                          title="Edit Film"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/30 text-red-400 transition-colors"
                          title="Hapus Film"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-white/40 italic">
                    Belum ada data film yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD / EDIT MOVIE MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/95 cursor-pointer"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-left"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                <h3 className="text-lg font-bold font-display text-white tracking-wide">
                  {editingMovie ? 'Edit Data Film' : 'Tambah Film Baru'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-textSub hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-textSub tracking-wider">JUDUL FILM</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Judul Film"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-textSub focus:outline-none focus:border-goldAccent focus:ring-1 focus:ring-goldAccent/30"
                    />
                  </div>

                  {/* Subtitle */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-textSub tracking-wider">SUBTITLE / BADGE (OPSIONAL)</label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      placeholder="Misal: Film Netflix, Tinggal Meninggal"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-textSub focus:outline-none focus:border-goldAccent"
                    />
                  </div>

                  {/* Release Year */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-textSub tracking-wider">TAHUN RILIS</label>
                    <input
                      type="number"
                      name="releaseYear"
                      required
                      value={formData.releaseYear}
                      onChange={handleInputChange}
                      placeholder="Contoh: 2024"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-textSub focus:outline-none focus:border-goldAccent"
                    />
                  </div>

                  {/* Duration */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-textSub tracking-wider">DURASI</label>
                    <input
                      type="text"
                      name="duration"
                      required
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="Contoh: 1h 50m atau 2 Jam 15 Menit"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-textSub focus:outline-none focus:border-goldAccent"
                    />
                  </div>

                  {/* Rating */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-textSub tracking-wider">RATING INITIAL (1.0 - 5.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      name="rating"
                      required
                      value={formData.rating}
                      onChange={handleInputChange}
                      placeholder="Contoh: 4.8"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-textSub focus:outline-none focus:border-goldAccent"
                    />
                  </div>

                  {/* Genres */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-textSub tracking-wider">GENRE (PISAH DENGAN KOMA)</label>
                    <input
                      type="text"
                      name="genres"
                      required
                      value={formData.genres}
                      onChange={handleInputChange}
                      placeholder="Contoh: Komedi, Horor, Romansa"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-textSub focus:outline-none focus:border-goldAccent"
                    />
                  </div>

                  {/* Sutradara */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-textSub tracking-wider">SUTRADARA</label>
                    <input
                      type="text"
                      name="director"
                      required
                      value={formData.director}
                      onChange={handleInputChange}
                      placeholder="Nama Sutradara"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-textSub focus:outline-none focus:border-goldAccent"
                    />
                  </div>

                  {/* Produser */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-textSub tracking-wider">PRODUSER</label>
                    <input
                      type="text"
                      name="producer"
                      value={formData.producer}
                      onChange={handleInputChange}
                      placeholder="Nama Produser"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-textSub focus:outline-none focus:border-goldAccent"
                    />
                  </div>
                </div>

                {/* Cast */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-textSub tracking-wider">PEMERAN UTAMA (PISAH DENGAN KOMA)</label>
                  <input
                    type="text"
                    name="cast"
                    value={formData.cast}
                    onChange={handleInputChange}
                    placeholder="Contoh: Bene Dion, Boris Bokir, Indra Jegel"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-textSub focus:outline-none focus:border-goldAccent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Poster Path */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-textSub tracking-wider">PATH / URL POSTER IMAGE</label>
                    <input
                      type="text"
                      name="poster"
                      required
                      value={formData.poster}
                      onChange={handleInputChange}
                      placeholder="Misal: /posters/dilan.jpg atau URL gambar"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-textSub focus:outline-none focus:border-goldAccent"
                    />
                  </div>

                  {/* Backdrop Path */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-textSub tracking-wider">PATH / URL BACKDROP IMAGE (OPSIONAL)</label>
                    <input
                      type="text"
                      name="backdropImage"
                      value={formData.backdropImage}
                      onChange={handleInputChange}
                      placeholder="Sama dengan poster jika dikosongkan"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-textSub focus:outline-none focus:border-goldAccent"
                    />
                  </div>
                </div>

                {/* Youtube Trailer Link */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-textSub tracking-wider">LINK TRAILER YOUTUBE (ID ATAU URL LENGKAP)</label>
                  <input
                    type="text"
                    name="youtubeId"
                    value={formData.youtubeId}
                    onChange={handleInputChange}
                    placeholder="Contoh: https://www.youtube.com/watch?v=AkzI_SbDXcs atau ID: AkzI_SbDXcs"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-textSub focus:outline-none focus:border-goldAccent"
                  />
                </div>

                {/* Synopsis */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-textSub tracking-wider">SINOPSIS</label>
                  <textarea
                    name="synopsis"
                    required
                    rows="4"
                    value={formData.synopsis}
                    onChange={handleInputChange}
                    placeholder="Masukkan jalan cerita/sinopsis film di sini..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-textSub focus:outline-none focus:border-goldAccent resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/5 hover:border-white/20"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-goldAccent text-cinemaBlack font-bold text-xs rounded-xl shadow-gold-glow hover:bg-amber-400"
                  >
                    {editingMovie ? 'Simpan Perubahan' : 'Tambah Film'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- YOUTUBE TRAILER POPUP PREVIEW --- */}
      <AnimatePresence>
        {previewMovie && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewMovie(null)}
              className="fixed inset-0 bg-black cursor-pointer"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10"
            >
              <div className="p-4 bg-zinc-900 border-b border-white/5 flex justify-between items-center">
                <span className="text-xs font-bold text-goldAccent font-display uppercase tracking-widest">
                  Preview Trailer: {previewMovie.title}
                </span>
                <button
                  onClick={() => setPreviewMovie(null)}
                  className="p-1 rounded-lg text-textSub hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={getEmbedUrl(previewMovie.youtubeId)}
                  title={`Trailer ${previewMovie.title}`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
