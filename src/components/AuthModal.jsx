import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Film, Eye, EyeOff, User, Lock, Mail, Sparkles, LogIn, UserPlus } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise((res) => setTimeout(res, 1200));

    // === Validation ===
    if (!form.email || !form.password) {
      setError('Email dan password wajib diisi.');
      setIsLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter.');
      setIsLoading(false);
      return;
    }

    if (mode === 'register') {
      if (!form.name.trim()) {
        setError('Nama lengkap wajib diisi.');
        setIsLoading(false);
        return;
      }
      // Check if trying to register admin email
      if (form.email === 'admin@bioskop.com') {
        setError('Email ini dicadangkan untuk Admin utama.');
        setIsLoading(false);
        return;
      }

      // Register: store user data in localStorage
      const users = JSON.parse(localStorage.getItem('cv_users') || '[]');
      const exists = users.find((u) => u.email === form.email);
      if (exists) {
        setError('Email sudah terdaftar. Silakan login.');
        setIsLoading(false);
        return;
      }
      const newUser = {
        id: Date.now().toString(),
        name: form.name,
        email: form.email,
        password: form.password, // Note: in production this should be hashed
        role: 'user',
        watchlist: [],
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      localStorage.setItem('cv_users', JSON.stringify(users));
      localStorage.setItem('cv_current_user', JSON.stringify({ id: newUser.id, name: newUser.name, email: newUser.email, role: 'user' }));
      onLogin({ id: newUser.id, name: newUser.name, email: newUser.email, role: 'user' });
      onClose();
    } else {
      // Login logic
      // 1. Check if it matches admin credentials first
      if (form.email === 'admin@bioskop.com' && form.password === '12345678') {
        const adminUser = { id: 'admin', name: 'Admin', email: 'admin@bioskop.com', role: 'admin' };
        localStorage.setItem('cv_current_user', JSON.stringify(adminUser));
        onLogin(adminUser);
        onClose();
        setIsLoading(false);
        return;
      }

      // 2. Validate against stored registered users
      const users = JSON.parse(localStorage.getItem('cv_users') || '[]');
      const user = users.find((u) => u.email === form.email && u.password === form.password);

      if (!user) {
        // Allow demo login with any other valid email/pass as a normal user
        if (form.email.includes('@') && form.password.length >= 6) {
          const demoUser = { id: 'demo-' + Date.now(), name: form.email.split('@')[0], email: form.email, role: 'user' };
          localStorage.setItem('cv_current_user', JSON.stringify(demoUser));
          onLogin(demoUser);
          onClose();
        } else {
          setError('Email atau password salah. Coba daftar terlebih dahulu.');
          setIsLoading(false);
          return;
        }
      } else {
        const sessionUser = { id: user.id, name: user.name, email: user.email, role: user.role || 'user' };
        localStorage.setItem('cv_current_user', JSON.stringify(sessionUser));
        onLogin(sessionUser);
        onClose();
      }
    }

    setIsLoading(false);
  };

  const switchMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError('');
    setForm({ name: '', email: '', password: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-10"
          >
            {/* Top decorative bar */}
            <div className="h-1 bg-gradient-to-r from-goldAccent via-amber-300 to-goldAccent"></div>

            {/* Header */}
            <div className="px-8 pt-8 pb-6 text-left border-b border-white/5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-goldAccent to-amber-600 flex items-center justify-center flex-shrink-0 shadow-gold-glow">
                    <Film className="w-5 h-5 text-cinemaBlack fill-cinemaBlack" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-xl text-white tracking-wide">
                      Cine<span className="text-goldAccent">Verse</span>
                    </h2>
                    <p className="text-xs text-textSub mt-0.5">
                      {mode === 'login' ? 'Masuk ke akun Anda' : 'Buat akun baru'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-textSub hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">

              {/* Register - Name field */}
              <AnimatePresence>
                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-1.5 text-left"
                  >
                    <label className="text-xs font-semibold text-textSub tracking-wide">
                      NAMA LENGKAP
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-textSub" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nama kamu"
                        className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-goldAccent focus:ring-1 focus:ring-goldAccent/30 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-textSub focus:outline-none transition-all duration-300"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-textSub tracking-wide">EMAIL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-textSub" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-goldAccent focus:ring-1 focus:ring-goldAccent/30 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-textSub focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-textSub tracking-wide">PASSWORD</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-textSub" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={mode === 'register' ? 'Minimal 6 karakter' : '••••••••'}
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-goldAccent focus:ring-1 focus:ring-goldAccent/30 rounded-xl py-3 pl-10 pr-11 text-sm text-white placeholder-textSub focus:outline-none transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-0 right-3.5 flex items-center text-textSub hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl text-left"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full py-3.5 rounded-xl bg-goldAccent text-cinemaBlack font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-gold-glow"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cinemaBlack border-t-transparent rounded-full animate-spin"></div>
                    <span>Memproses...</span>
                  </>
                ) : mode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>MASUK SEKARANG</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>DAFTAR SEKARANG</span>
                  </>
                )}
              </motion.button>

              {/* Mode Switch */}
              <div className="text-center text-xs text-textSub pt-1">
                {mode === 'login' ? (
                  <>
                    Belum punya akun?{' '}
                    <button
                      type="button"
                      onClick={switchMode}
                      className="text-goldAccent font-semibold hover:underline"
                    >
                      Daftar sekarang
                    </button>
                  </>
                ) : (
                  <>
                    Sudah punya akun?{' '}
                    <button
                      type="button"
                      onClick={switchMode}
                      className="text-goldAccent font-semibold hover:underline"
                    >
                      Masuk di sini
                    </button>
                  </>
                )}
              </div>
            </form>

            {/* Footer Disclaimer */}
            <div className="px-8 py-4 border-t border-white/5 flex items-center gap-2 bg-white/[0.015]">
              <Sparkles className="w-3.5 h-3.5 text-goldAccent flex-shrink-0" />
              <p className="text-[10px] text-textSub">
                Data tersimpan di perangkat Anda. Login untuk menyimpan watchlist dan preferensi antar sesi.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
