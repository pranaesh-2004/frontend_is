import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../services/wishlistService';

export function useWishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user) {
      fetchWishlist().then(setWishlist).catch(console.error);
    } else {
      setWishlist([]);
    }
  }, [user]);

  const toggleWishlist = async (product) => {
    if (!user) return;

    const exists = wishlist.find(i => i._id === product._id);
    let updatedWishlist;

    if (exists) {
      await removeFromWishlist(product._id);
      updatedWishlist = wishlist.filter(i => i._id !== product._id);
    } else {
      const addedProduct = await addToWishlist(product._id);
      updatedWishlist = [...wishlist, addedProduct];
    }

    setWishlist(updatedWishlist);
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  return { wishlist, toggleWishlist, isInWishlist };
}