import { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children, currentUser }) => {
  // Load watchlist per-user from localStorage
  const getStorageKey = (userId) => `cv_watchlist_${userId || 'guest'}`;

  const [watchlist, setWatchlist] = useState(() => {
    const key = getStorageKey(currentUser?.id);
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Reload watchlist when user changes (login/logout)
  useEffect(() => {
    const key = getStorageKey(currentUser?.id);
    const saved = localStorage.getItem(key);
    setWatchlist(saved ? JSON.parse(saved) : []);
  }, [currentUser?.id]);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    const key = getStorageKey(currentUser?.id);
    localStorage.setItem(key, JSON.stringify(watchlist));
  }, [watchlist, currentUser?.id]);

  const showToast = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 3000);
  };

  const addToWatchlist = (movie, onRequireAuth) => {
    if (!currentUser) {
      if (onRequireAuth) onRequireAuth();
      showToast('Silakan login untuk menyimpan watchlist', 'warning');
      return;
    }
    if (watchlist.some((m) => m.id === movie.id)) {
      showToast(`"${movie.title}" sudah ada di Watchlist!`, 'warning');
      return;
    }
    setWatchlist((prev) => [...prev, movie]);
    showToast(`Berhasil ditambahkan ke Watchlist`);
  };

  const removeFromWatchlist = (movieId) => {
    const movie = watchlist.find((m) => m.id === movieId);
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
    showToast(`"${movie?.title || 'Film'}" dihapus dari Watchlist`, 'info');
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, notification, addToWatchlist, removeFromWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error('useWatchlist must be used within WatchlistProvider');
  return context;
};
