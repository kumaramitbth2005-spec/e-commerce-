import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const save = (list) => {
    setWishlist(list);
    localStorage.setItem('wishlist', JSON.stringify(list));
  };

  const isWishlisted = useCallback(
    (productId) => wishlist.some((p) => (p._id || p.id) === productId),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    (product) => {
      const id = product._id || product.id;
      const already = wishlist.some((p) => (p._id || p.id) === id);
      if (already) {
        const updated = wishlist.filter((p) => (p._id || p.id) !== id);
        save(updated);
        toast.info('Removed from wishlist');
      } else {
        const updated = [...wishlist, product];
        save(updated);
        toast.success('❤️ Added to wishlist!');
      }
    },
    [wishlist]
  );

  const removeFromWishlist = useCallback(
    (productId) => {
      const updated = wishlist.filter((p) => (p._id || p.id) !== productId);
      save(updated);
    },
    [wishlist]
  );

  const clearWishlist = useCallback(() => {
    save([]);
    toast.info('Wishlist cleared');
  }, []);

  return (
    <WishlistContext.Provider
      value={{ wishlist, isWishlisted, toggleWishlist, removeFromWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
